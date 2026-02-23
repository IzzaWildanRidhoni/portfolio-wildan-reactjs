<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'icon_url', 'color', 'order'];
}
