<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$rows = \Illuminate\Support\Facades\DB::table('business_requests')->select('id','company_name','email','phone','status','created_at')->limit(20)->get();
echo "Business requests (up to 20):\n";
foreach($rows as $r) {
    echo "ID: {$r->id}, company_name: {$r->company_name}, email: {$r->email}, phone: {$r->phone}, status: {$r->status}, created_at: {$r->created_at}\n";
}
?>