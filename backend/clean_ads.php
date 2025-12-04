<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// حذف الإعلانات التي تحتوي على blob URLs
\Illuminate\Support\Facades\DB::table('advertisements')
    ->where('image_path', 'like', 'blob:%')
    ->orWhere('image_path', 'like', 'data:%')
    ->delete();

echo "تم حذف الإعلانات السيئة\n";

// عرض الإعلانات المتبقية
$ads = \Illuminate\Support\Facades\DB::table('advertisements')->select('id', 'title', 'image_path')->get();

echo "\nالإعلانات المتبقية:\n";
foreach($ads as $ad) {
    echo "ID: {$ad->id}, Title: {$ad->title}, Path: {$ad->image_path}\n";
}
?>
