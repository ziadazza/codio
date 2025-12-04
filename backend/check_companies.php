<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$rows = \Illuminate\Support\Facades\DB::table('business_requests')->select('id', 'company_name', 'email', 'phone', 'promotional_images')->limit(10)->get();
echo "Business requests (up to 10):\n";
foreach($rows as $r) {
    echo "ID: {$r->id}, company_name: {$r->company_name}, email: {$r->email}, phone: {$r->phone}, promotional_images: ".json_encode($r->promotional_images)."\n";
}
?>