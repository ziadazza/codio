<?php

namespace App\Http\Controllers;

use App\Models\BusinessRequest;
use App\Models\User;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index()
    {
        $totalRequests = BusinessRequest::count();
        $activeUsers = User::where('status', 'active')->count();
        $newRequests = BusinessRequest::where('status', 'جديد')->count();
        $completedRequests = BusinessRequest::where('status', 'مكتمل')->count();
        $rejectedRequests = BusinessRequest::where('status', 'مرفوض')->count();
        $totalAds = Advertisement::count();
        $activeAds = Advertisement::where('status', 'active')->count();
        $totalImpressions = Advertisement::sum('impressions') ?? 0;
        $totalClicks = Advertisement::sum('clicks') ?? 0;

        $clickThroughRate = $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100, 2) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'totalRequests' => $totalRequests,
                'activeUsers' => $activeUsers,
                'newMessages' => $newRequests,
                'revenue' => $completedRequests * 5000,
                'pendingRequests' => BusinessRequest::whereIn('status', ['جديد', 'قيد المراجعة'])->count(),
                'completedRequests' => $completedRequests,
                'rejectedRequests' => $rejectedRequests,
                'totalAds' => $totalAds,
                'activeAds' => $activeAds,
                'totalImpressions' => $totalImpressions,
                'totalClicks' => $totalClicks,
                'clickThroughRate' => $clickThroughRate
            ]
        ]);
    }

    // دالة عامة للإحصائيات (بدون مصادقة)
    public function indexPublic()
    {
        $partners = BusinessRequest::count(); // عدد الشركات/الشركاء
        $deals = BusinessRequest::where('status', 'مكتمل')->count(); // العروض المكتملة
        $activeAds = Advertisement::where('status', 'active')->count(); // الإعلانات النشطة
        $savings = Advertisement::sum('impressions') ?? 0; // عدد الزيارات/المدخرات

        return response()->json([
            'success' => true,
            'data' => [
                'partners' => $partners > 0 ? $partners : 1, // إذا لم يكن هناك بيانات، استخدم 1
                'deals' => $deals > 0 ? $deals : 0,
                'users' => $activeAds, // عدد الإعلانات النشطة
                'savings' => $savings
            ]
        ]);
    }
}
