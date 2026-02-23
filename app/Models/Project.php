<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'demo_url',
        'repo_url',
        'tech_stack',
        'is_featured',
        'order'
    ];
    protected $casts = [
        'tech_stack' => 'array',
        'is_featured' => 'boolean',
    ];
}
