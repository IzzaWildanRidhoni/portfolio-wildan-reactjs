<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = [
        'title',
        'issuer',
        'credential_id',
        'thumbnail',
        'issued_date',
        'type',
        'category',
        'credential_url'
    ];
}
