<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // إنشاء مستخدم افتراضي
        AdminUser::create([
            'name' => 'مدير النظام',
            'username' => 'admin',
            'email' => 'admin@codio.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'status' => 'active'
        ]);

        // إضافة مستخدمي فريق نشطين
        User::create([
            'name' => 'أحمد الإداري',
            'email' => 'admin.ahmed@codio.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'team_role' => 'رئيس الفريق',
            'department' => 'الإدارة',
            'profile_image' => 'https://via.placeholder.com/150'
        ]);

        User::create([
            'name' => 'فاطمة المصممة',
            'email' => 'fatima.designer@codio.com',
            'password' => Hash::make('password'),
            'role' => 'team_member',
            'status' => 'active',
            'team_role' => 'مصممة واجهات',
            'department' => 'التصميم',
            'profile_image' => 'https://via.placeholder.com/150'
        ]);

        User::create([
            'name' => 'محمد المطور',
            'email' => 'mohammad.dev@codio.com',
            'password' => Hash::make('password'),
            'role' => 'team_member',
            'status' => 'active',
            'team_role' => 'مطور ويب',
            'department' => 'التطوير',
            'profile_image' => 'https://via.placeholder.com/150'
        ]);

        User::create([
            'name' => 'ليلى الموارد البشرية',
            'email' => 'layla.hr@codio.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'status' => 'active',
            'team_role' => 'مديرة الموارد البشرية',
            'department' => 'الموارد البشرية',
            'profile_image' => 'https://via.placeholder.com/150'
        ]);

        User::create([
            'name' => 'علي التسويق',
            'email' => 'ali.marketing@codio.com',
            'password' => Hash::make('password'),
            'role' => 'team_member',
            'status' => 'active',
            'team_role' => 'مسؤول التسويق',
            'department' => 'التسويق',
            'profile_image' => 'https://via.placeholder.com/150'
        ]);

        // يمكنك إضافة بيانات تجريبية أخرى هنا
    }
}
