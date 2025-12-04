<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $table = 'team_members';

    protected $fillable = [
        'request_id',
        'name',
        'position',
        'image_path'
    ];

    public function businessRequest()
    {
        return $this->belongsTo(BusinessRequest::class, 'request_id');
    }
}