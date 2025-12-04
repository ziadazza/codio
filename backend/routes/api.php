<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessRequestController;
use App\Http\Controllers\AdvertisementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Routes المفتوحة (بدون مصادقة)
Route::get('/team-members', [UserController::class, 'teamMembers']);
Route::get('/users/public', [UserController::class, 'indexPublic']);
Route::get('/stats/public', [StatsController::class, 'indexPublic']);
Route::post('/business-requests', [BusinessRequestController::class, 'store']); // نموذج الشراكة عام

// Routes المحمية
Route::middleware('auth:sanctum')->group(function () {
    // Business Requests Routes
    Route::get('/business-requests', [BusinessRequestController::class, 'index']);
    Route::get('/business-requests/{id}', [BusinessRequestController::class, 'show']);
    Route::put('/business-requests/{id}', [BusinessRequestController::class, 'update']);
    Route::delete('/business-requests/{id}', [BusinessRequestController::class, 'destroy']);
    Route::patch('/business-requests/{id}/status', [BusinessRequestController::class, 'updateStatus']);

    // Users Routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Advertisements Routes
    Route::get('/advertisements', [AdvertisementController::class, 'index']);
    Route::post('/advertisements', [AdvertisementController::class, 'store']);
    Route::get('/advertisements/{id}', [AdvertisementController::class, 'show']);
    Route::put('/advertisements/{id}', [AdvertisementController::class, 'update']);
    Route::delete('/advertisements/{id}', [AdvertisementController::class, 'destroy']);

    // Statistics
    Route::get('/stats', [StatsController::class, 'index']);

    // Upload
    Route::post('/upload', [UploadController::class, 'upload']);
});