<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail',
        'meta_title',
        'meta_description',
        'tags',
        'is_published',
        'published_at',
        'order',
        'views',
        'blog_category_id',
    ];

    protected $casts = [
        'tags'         => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Auto-generate slug jika tidak diisi
    protected function slug(): Attribute
    {
        return Attribute::make(
            set: fn($value, $attributes) => $value ?? Str::slug($attributes['title']),
        );
    }

    // Scope untuk published blogs
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    // Scope untuk ordered blogs
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')
            ->orderBy('published_at', 'desc');
    }

    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }
}
