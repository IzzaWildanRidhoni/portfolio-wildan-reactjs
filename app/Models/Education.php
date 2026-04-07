<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Education extends Model
{
    use HasFactory;


    protected $table = 'educations';

    protected $fillable = [
        'institution',
        'logo',
        'degree',
        'field',
        'gpa',
        'start_year',
        'end_year',
        'location',
        'order',
    ];

    // Casting tipe data untuk konsistensi
    protected $casts = [
        'gpa'        => 'string',
        'start_year' => 'string',
        'end_year'   => 'string',
        'order'      => 'integer',
    ];
}
