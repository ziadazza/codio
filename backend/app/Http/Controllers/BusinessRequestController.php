<?php

namespace App\Http\Controllers;

use App\Models\BusinessRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PromotionalImage;
use App\Models\TeamMember;

class BusinessRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = BusinessRequest::with(['promotionalImages', 'teamMembers']);

        // البحث
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('company_name', 'LIKE', "%{$search}%")
                  ->orWhere('contact_person', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        // التصفية حسب الحالة
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // الترتيب
        $query->orderBy('created_at', 'desc');

        // Pagination
        $perPage = $request->get('per_page', 50);
        $requests = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $requests->items(),
            'pagination' => [
                'total' => $requests->total(),
                'page' => $requests->currentPage(),
                'per_page' => $requests->perPage(),
                'total_pages' => $requests->lastPage()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'business_type' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
            'number_of_branches' => 'nullable|integer|min:1',
            'status' => 'nullable|string|in:جديد,قيد المراجعة,مكتمل,مرفوض'
        ]);

        DB::beginTransaction();
        try {
            $businessRequest = BusinessRequest::create(array_merge($validated, [
                'notes' => $request->notes ?? 'لا توجد ملاحظات',
                'whatsapp' => $request->whatsapp ?? $request->phone,
                'company_name_en' => $request->company_name_en,
                'establishment_year' => $request->establishment_year,
                'employee_count' => $request->employee_count,
                'district' => $request->district,
                'street' => $request->street,
                'building_number' => $request->building_number,
                'website' => $request->website,
                'instagram' => $request->instagram,
                'facebook' => $request->facebook,
                'telegram' => $request->telegram,
                'linkedin' => $request->linkedin,
                'tiktok' => $request->tiktok,
                'snapchat' => $request->snapchat,
                'cost_effectiveness' => $request->cost_effectiveness,
                'brand_building' => $request->brand_building,
                'marketing_results' => $request->marketing_results,
            ]));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Business request created successfully',
                'data' => $businessRequest
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create business request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $businessRequest = BusinessRequest::with(['promotionalImages', 'teamMembers'])->find($id);

        if (!$businessRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Business request not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $businessRequest
        ]);
    }

    public function update(Request $request, $id)
    {
        $businessRequest = BusinessRequest::find($id);

        if (!$businessRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Business request not found'
            ], 404);
        }

        $validated = $request->validate([
            'company_name' => 'sometimes|required|string|max:255',
            'contact_person' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email',
            'phone' => 'sometimes|required|string|max:20',
            'status' => 'sometimes|required|string|in:جديد,قيد المراجعة,مكتمل,مرفوض'
        ]);

        DB::beginTransaction();
        try {
            $businessRequest->update(array_merge($validated, [
                'notes' => $request->notes ?? $businessRequest->notes,
                'whatsapp' => $request->whatsapp ?? $businessRequest->whatsapp,
                'company_name_en' => $request->company_name_en ?? $businessRequest->company_name_en,
                'establishment_year' => $request->establishment_year ?? $businessRequest->establishment_year,
                'employee_count' => $request->employee_count ?? $businessRequest->employee_count,
                'district' => $request->district ?? $businessRequest->district,
                'street' => $request->street ?? $businessRequest->street,
                'building_number' => $request->building_number ?? $businessRequest->building_number,
                'website' => $request->website ?? $businessRequest->website,
                'instagram' => $request->instagram ?? $businessRequest->instagram,
                'facebook' => $request->facebook ?? $businessRequest->facebook,
                'telegram' => $request->telegram ?? $businessRequest->telegram,
                'linkedin' => $request->linkedin ?? $businessRequest->linkedin,
                'tiktok' => $request->tiktok ?? $businessRequest->tiktok,
                'snapchat' => $request->snapchat ?? $businessRequest->snapchat,
                'cost_effectiveness' => $request->cost_effectiveness ?? $businessRequest->cost_effectiveness,
                'brand_building' => $request->brand_building ?? $businessRequest->brand_building,
                'marketing_results' => $request->marketing_results ?? $businessRequest->marketing_results,
            ]));

            if ($request->has('promotional_images') && is_array($request->promotional_images)) {
                $this->syncPromotionalImages($businessRequest, $request->promotional_images, false);
            }

            if ($request->has('team_members') && is_array($request->team_members)) {
                $this->syncTeamMembers($businessRequest, $request->team_members, false);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Business request updated successfully',
                'data' => $businessRequest
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update business request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $businessRequest = BusinessRequest::find($id);

        if (!$businessRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Business request not found'
            ], 404);
        }

        DB::beginTransaction();
        try {
            $businessRequest->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Business request deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete business request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:جديد,قيد المراجعة,مكتمل,مرفوض'
        ]);

        $businessRequest = BusinessRequest::find($id);

        if (!$businessRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Business request not found'
            ], 404);
        }

        $businessRequest->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $businessRequest
        ]);
    }

    // الدوال الخاصة - يجب أن تكون داخل الفصل
    private function normalizeImagePath(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // Remove full URL if provided
        if (str_contains($path, '/storage/')) {
            $parts = explode('/storage/', $path, 2);
            $path = $parts[1];
        }

        return ltrim(str_replace('storage/', '', $path), '/');
    }

    private function syncPromotionalImages(BusinessRequest $businessRequest, array $images, bool $replace = true): void
    {
        if ($replace) {
            $businessRequest->promotionalImages()->delete();
        }

        foreach ($images as $image) {
            if (is_array($image)) {
                $path = $image['image_path'] ?? $image['path'] ?? $image['url'] ?? null;
                $url = $image['image_url'] ?? $image['url'] ?? null;
            } else {
                $path = $image;
                $url = null;
            }

            if (!$path) {
                continue;
            }

            $normalizedPath = $this->normalizeImagePath($path);

            $businessRequest->promotionalImages()->create([
                'image_path' => $normalizedPath,
                'image_url' => $url,
            ]);
        }
    }

    private function syncTeamMembers(BusinessRequest $businessRequest, array $members, bool $replace = true): void
    {
        if ($replace) {
            $businessRequest->teamMembers()->delete();
        }

        foreach ($members as $member) {
            if (!is_array($member)) {
                continue;
            }

            $imagePath = $member['image_path'] ?? $member['image'] ?? null;

            $businessRequest->teamMembers()->create([
                'name' => $member['name'] ?? 'عضو',
                'position' => $member['position'] ?? null,
                'image_path' => $this->normalizeImagePath($imagePath),
            ]);
        }
    }
}