<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromotionalImage extends Model
{
    use HasFactory;

    protected $table = 'promotional_images';

    protected $fillable = [
        'request_id',
        'image_path',
        'image_url'
    ];

    public function businessRequest()
    {
        return $this->belongsTo(BusinessRequest::class, 'request_id');
    }
}