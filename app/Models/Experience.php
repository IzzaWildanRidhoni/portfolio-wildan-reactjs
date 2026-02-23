<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'title',
        'company',
        'logo',
        'location',
        'start_date',
        'end_date',
        'duration',
        'type',
        'work_mode',
        'description',
        'order'
    ];
}
