<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('business_requests', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('contact_person');
            $table->string('email');
            $table->string('phone');
            $table->string('business_type')->nullable();
            $table->string('city')->nullable();
            $table->string('position')->nullable();
            $table->integer('number_of_branches')->default(1);
            $table->enum('status', ['جديد', 'قيد المراجعة', 'مكتمل', 'مرفوض'])->default('جديد');
            $table->text('notes')->nullable();
            
            // Additional fields
            $table->string('whatsapp')->nullable();
            $table->string('company_name_en')->nullable();
            $table->integer('establishment_year')->nullable();
            $table->integer('employee_count')->nullable();
            $table->string('district')->nullable();
            $table->string('street')->nullable();
            $table->string('building_number')->nullable();
            $table->string('website')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('telegram')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('tiktok')->nullable();
            $table->string('snapchat')->nullable();
            $table->text('cost_effectiveness')->nullable();
            $table->text('brand_building')->nullable();
            $table->text('marketing_results')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('business_requests');
    }
};