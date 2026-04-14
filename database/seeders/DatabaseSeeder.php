<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProfileSeeder::class,
            SkillSeeder::class,
            ExperienceSeeder::class,
            EducationSeeder::class,
            ProjectSeeder::class,
            AchievementSeeder::class,
            SocialLinkSeeder::class,
            MessageSeeder::class,
            BlogCategorySeeder::class,
            AdminSeeder::class,
        ]);
    }
}
