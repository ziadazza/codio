<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$ads = \Illuminate\Support\Facades\DB::table('advertisements')->select('id', 'title', 'image_path')->limit(5)->get();

foreach($ads as $ad) {
    echo "ID: {$ad->id}, Title: {$ad->title}, Path: {$ad->image_path}\n";
}
?>
