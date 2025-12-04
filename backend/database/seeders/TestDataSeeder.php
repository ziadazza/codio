<?php

namespace Database\Seeders;

use App\Models\BusinessRequest;
use App\Models\User;
use App\Models\Advertisement;
use App\Models\AdminUser;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // إضافة admin user
        AdminUser::firstOrCreate(
            ['email' => 'admin@codio.com'],
            [
                'name' => 'مدير النظام',
                'email' => 'admin@codio.com',
                'username' => 'admin',
                'password' => bcrypt('password123'),
                'role' => 'super_admin',
                'status' => 'active'
            ]
        );

        // إضافة شركات تجريبية
        $companies = [
            [
                'company_name' => 'شركة التكنولوجيا المتقدمة',
                'contact_person' => 'أحمد محمود',
                'email' => 'ahmad@tech-advanced.com',
                'phone' => '01012345678',
                'whatsapp' => '01012345678',
                'business_type' => 'تكنولوجيا المعلومات',
                'city' => 'القاهرة',
                'position' => 'مدير التسويق',
                'number_of_branches' => 5,
                'status' => 'جديد',
                'notes' => 'شركة متخصصة في تطوير البرمجيات',
                'company_name_en' => 'Advanced Tech Company',
                'establishment_year' => 2015,
                'employee_count' => 50,
                'district' => 'مدينة نصر',
                'street' => 'شارع النيل',
                'building_number' => '123',
                'website' => 'https://tech-advanced.com',
                'instagram' => '@tech_advanced',
                'facebook' => '@techadvanced',
                'telegram' => '@techadvanced',
                'linkedin' => 'tech-advanced',
                'tiktok' => '@techadvanced',
                'snapchat' => '@techadvanced',
                'cost_effectiveness' => 'عالية جداً',
                'brand_building' => 'تحسين الوعي بالعلامة التجارية',
                'marketing_results' => 'زيادة المبيعات بنسبة 45%',
            ],
            [
                'company_name' => 'وكالة التسويق الرقمي',
                'contact_person' => 'فاطمة علي',
                'email' => 'fatima@digital-agency.com',
                'phone' => '01098765432',
                'whatsapp' => '01098765432',
                'business_type' => 'خدمات التسويق الرقمي',
                'city' => 'الإسكندرية',
                'position' => 'المدير التنفيذي',
                'number_of_branches' => 3,
                'status' => 'قيد المراجعة',
                'notes' => 'وكالة متخصصة في التسويق عبر وسائل التواصل الاجتماعي',
                'company_name_en' => 'Digital Marketing Agency',
                'establishment_year' => 2018,
                'employee_count' => 25,
                'district' => 'الدرارة',
                'street' => 'شارع الحرية',
                'building_number' => '456',
                'website' => 'https://digital-agency.com',
                'instagram' => '@digital_agency',
                'facebook' => '@digitalagency',
                'telegram' => '@digitalagency',
                'linkedin' => 'digital-agency',
                'tiktok' => '@digitalagency',
                'snapchat' => '@digitalagency',
                'cost_effectiveness' => 'متوسطة',
                'brand_building' => 'بناء حضور قوي على الإنترنت',
                'marketing_results' => 'تزايد التفاعل بنسبة 60%',
            ],
            [
                'company_name' => 'متجر الملابس الإلكتروني',
                'contact_person' => 'محمد سالم',
                'email' => 'mohamed@fashion-shop.com',
                'phone' => '01156789012',
                'whatsapp' => '01156789012',
                'business_type' => 'التجارة الإلكترونية',
                'city' => 'جدة',
                'position' => 'مسؤول التسويق',
                'number_of_branches' => 2,
                'status' => 'مكتمل',
                'notes' => 'متجر متخصص في بيع الملابس والأحذية',
                'company_name_en' => 'Fashion E-Shop',
                'establishment_year' => 2020,
                'employee_count' => 15,
                'district' => 'الروضة',
                'street' => 'شارع التجارة',
                'building_number' => '789',
                'website' => 'https://fashion-shop.com',
                'instagram' => '@fashion_shop',
                'facebook' => '@fashionshop',
                'telegram' => '@fashionshop',
                'linkedin' => 'fashion-shop',
                'tiktok' => '@fashionshop',
                'snapchat' => '@fashionshop',
                'cost_effectiveness' => 'منخفضة',
                'brand_building' => 'تطوير هوية بصرية مميزة',
                'marketing_results' => 'زيادة عدد العملاء الجدد بنسبة 80%',
            ],
        ];

        foreach ($companies as $company) {
            BusinessRequest::create($company);
        }

        // إضافة مستخدمين تجريبيين
        $users = [
            [
                'name' => 'أحمد الإداري',
                'email' => 'admin.ahmed@codio.com',
                'password' => bcrypt('password123'),
                'phone' => '01001234567',
                'role' => 'مدير',
                'status' => 'نشط',
                'profile_image' => 'https://via.placeholder.com/150',
                'team_role' => 'رئيس الفريق',
                'department' => 'الإدارة',
            ],
            [
                'name' => 'سارة المحللة',
                'email' => 'sarah.analyst@codio.com',
                'password' => bcrypt('password123'),
                'phone' => '01009876543',
                'role' => 'محلل',
                'status' => 'نشط',
                'profile_image' => 'https://via.placeholder.com/150',
                'team_role' => 'محلل بيانات',
                'department' => 'التحليل',
            ],
            [
                'name' => 'علي المسوق',
                'email' => 'ali.marketing@codio.com',
                'password' => bcrypt('password123'),
                'phone' => '01112345678',
                'role' => 'مسوق',
                'status' => 'نشط',
                'profile_image' => 'https://via.placeholder.com/150',
                'team_role' => 'مسوق رقمي',
                'department' => 'التسويق',
            ],
        ];

        foreach ($users as $user) {
            \App\Models\User::firstOrCreate(['email' => $user['email']], $user);
        }

        // إضافة إعلانات تجريبية
        $ads = [
            [
                'title' => 'خصم 50% على جميع المنتجات',
                'description' => 'عرض محدود الوقت - استمتع بخصم كبير على جميع منتجاتنا',
                'target_url' => 'https://shop.example.com/sale',
                'image_path' => 'https://via.placeholder.com/600x400?text=Sale',
                'status' => 'active',
                'start_date' => now()->toDateString(),
                'end_date' => now()->addDays(30)->toDateString(),
                'impressions' => 5000,
                'clicks' => 250,
            ],
            [
                'title' => 'منتج جديد - تطبيق الموبايل الثوري',
                'description' => 'اكتشف التطبيق الجديد الذي سيغير حياتك اليومية',
                'target_url' => 'https://app.example.com/new-app',
                'image_path' => 'https://via.placeholder.com/600x400?text=App',
                'status' => 'active',
                'start_date' => now()->toDateString(),
                'end_date' => now()->addDays(15)->toDateString(),
                'impressions' => 8200,
                'clicks' => 412,
            ],
            [
                'title' => 'انضم إلى برنامج الولاء الحصري',
                'description' => 'احصل على نقاط مكافآت مع كل عملية شراء',
                'target_url' => 'https://loyalty.example.com/join',
                'image_path' => 'https://via.placeholder.com/600x400?text=Loyalty',
                'status' => 'active',
                'start_date' => now()->toDateString(),
                'end_date' => now()->addDays(60)->toDateString(),
                'impressions' => 3500,
                'clicks' => 140,
            ],
        ];

        foreach ($ads as $ad) {
            Advertisement::create($ad);
        }
    }
}
