<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessRequest extends Model
{
    use HasFactory;

    protected $table = 'business_requests';

    protected $fillable = [
        'company_name',
        'contact_person',
        'email',
        'phone',
        'business_type',
        'city',
        'position',
        'number_of_branches',
        'status',
        'notes',
        'whatsapp',
        'company_name_en',
        'establishment_year',
        'employee_count',
        'district',
        'street',
        'building_number',
        'website',
        'instagram',
        'facebook',
        'telegram',
        'linkedin',
        'tiktok',
        'snapchat',
        'cost_effectiveness',
        'brand_building',
        'marketing_results'
    ];

    protected $casts = [
        'number_of_branches' => 'integer',
        'establishment_year' => 'integer',
        'employee_count' => 'integer'
    ];

    public function promotionalImages()
    {
        return $this->hasMany(PromotionalImage::class, 'request_id');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'request_id');
    }
}