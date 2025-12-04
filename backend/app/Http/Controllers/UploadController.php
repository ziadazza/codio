<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
        ]);

        try {
            $file = $request->file('file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // حفظ الملف في public disk
            $path = $file->storeAs('uploads', $filename, 'public');
            
            // الحصول على URL العام للملف
            $url = Storage::disk('public')->url($path);
            
            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => $url,
                'filename' => $filename
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل رفع الملف: ' . $e->getMessage()
            ], 500);
        }
    }
}



