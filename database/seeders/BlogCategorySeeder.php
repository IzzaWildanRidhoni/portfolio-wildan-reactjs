<?php
// database/seeders/BlogCategorySeeder.php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Tutorial',   'slug' => 'tutorial',   'color' => '#6366f1', 'order' => 1],
            ['name' => 'Tips & Trik', 'slug' => 'tips-trik',  'color' => '#10b981', 'order' => 2],
            ['name' => 'News',       'slug' => 'news',       'color' => '#f59e0b', 'order' => 3],
            ['name' => 'Review',     'slug' => 'review',     'color' => '#ef4444', 'order' => 4],
        ];

        foreach ($categories as $cat) {
            BlogCategory::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
