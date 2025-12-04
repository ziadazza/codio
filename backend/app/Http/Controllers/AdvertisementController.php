<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    public function index(Request $request)
    {
        $query = Advertisement::query();

        // البحث
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        // التصفية حسب الحالة
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Pagination
        $perPage = $request->get('per_page', 50);
        $ads = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $ads->items(),
            'pagination' => [
                'total' => $ads->total(),
                'per_page' => $ads->perPage(),
                'current_page' => $ads->currentPage(),
                'last_page' => $ads->lastPage()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_url' => 'nullable|url',
            'image_path' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date'
        ]);

        // منع حفظ blob URLs
        if (isset($validated['image_path']) && (strpos($validated['image_path'], 'blob:') === 0 || strpos($validated['image_path'], 'data:') === 0)) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حفظ صورة مؤقتة. يرجى الانتظار حتى اكتمال الرفع.'
            ], 422);
        }

        // التأكد من أن image_path موجود
        if (empty($validated['image_path'])) {
            return response()->json([
                'success' => false,
                'message' => 'صورة الإعلان مطلوبة'
            ], 422);
        }

        $ad = Advertisement::create(array_merge($validated, [
            'impressions' => 0,
            'clicks' => 0,
            'status' => $validated['status'] ?? 'active'
        ]));

        return response()->json([
            'success' => true,
            'data' => $ad
        ], 201);
    }

    public function show($id)
    {
        $ad = Advertisement::find($id);

        if (!$ad) {
            return response()->json([
                'success' => false,
                'message' => 'Advertisement not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ad
        ]);
    }

    public function update(Request $request, $id)
    {
        $ad = Advertisement::find($id);

        if (!$ad) {
            return response()->json([
                'success' => false,
                'message' => 'Advertisement not found'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'target_url' => 'sometimes|url',
            'image_path' => 'sometimes|string',
            'status' => 'sometimes|string|in:active,inactive',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date'
        ]);

        $ad->update($validated);

        return response()->json([
            'success' => true,
            'data' => $ad
        ]);
    }

    public function destroy($id)
    {
        $ad = Advertisement::find($id);

        if (!$ad) {
            return response()->json([
                'success' => false,
                'message' => 'Advertisement not found'
            ], 404);
        }

        $ad->delete();

        return response()->json([
            'success' => true,
            'message' => 'Advertisement deleted successfully'
        ]);
    }
}
