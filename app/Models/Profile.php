<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name',
        'username',
        'title',
        'location',
        'work_type',
        'bio',
        'avatar',
        'email',
        'whatsapp',
        'github',
        'linkedin',
        'instagram',
        'tiktok',
        'is_verified'
    ];
}
