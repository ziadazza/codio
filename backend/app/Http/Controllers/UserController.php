<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{


    public function index(Request $request)
    {
        $query = User::query();

        // البحث
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 50);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'] ?? 'user',
            'status' => $validated['status'] ?? 'active'
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ], 201);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|string',
            'status' => 'sometimes|string|in:active,inactive'
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
     // إضافة هذه الدالة للفريق
    public function teamMembers(Request $request)
    {
        try {
            // جلب أعضاء الفريق النشطين فقط
            $teamMembers = User::where('status', 'active')
                ->where(function($query) {
                    $query->whereIn('role', ['admin', 'manager', 'team_member'])
                          ->orWhereNotNull('team_role');
                })
                ->select([
                    'id',
                    'name',
                    'email',
                    'profile_image as image',
                    'team_role as specialty',
                    'department as position'
                ])
                ->get();

            // تحويل البيانات إلى التنسيق المطلوب
            $formattedMembers = $teamMembers->map(function ($user) {
                // معالجة الصور: إذا كانت URL كاملة، استخدمها مباشرة
                $imageUrl = null;
                if ($user->image) {
                    if (filter_var($user->image, FILTER_VALIDATE_URL)) {
                        // إذا كانت URL كاملة
                        $imageUrl = $user->image;
                    } else {
                        // إذا كانت path نسبي
                        $imageUrl = asset('storage/' . $user->image);
                    }
                }
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'specialty' => $user->specialty ?? 'عضو فريق',
                    'image' => $imageUrl,
                    'position' => $user->position,
                    'email' => $user->email,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedMembers
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch team members: ' . $e->getMessage()
            ], 500);
        }
    }

    // دالة عامة للمستخدمين (بدون حماية)
    public function indexPublic()
    {
        try {
            $users = User::where('status', 'active')
                ->select(['id', 'name', 'email', 'profile_image'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $users
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage()
            ], 500);
        }
    }
}