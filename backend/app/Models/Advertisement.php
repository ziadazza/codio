<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;

    protected $table = 'advertisements';

    protected $fillable = [
        'title',
        'description',
        'target_url',
        'image_path',
        'status',
        'start_date',
        'end_date',
        'impressions',
        'clicks'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'impressions' => 'integer',
        'clicks' => 'integer'
    ];
}