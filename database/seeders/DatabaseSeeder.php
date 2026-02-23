<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Achievement;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Profile::create([
            'name' => 'Satria Bahari',
            'username' => 'satriabahari',
            'title' => 'Software Engineer',
            'location' => 'Jambi, Indonesia',
            'work_type' => 'Onsite',
            'bio' => 'Seorang Software Engineer dan kreator konten coding yang berdedikasi untuk membangun solusi digital yang berdampak. Saya spesialis dalam pengembangan platform web yang skalabel dan aplikasi mobile menggunakan tech stack modern, terutama Next.js, TypeScript, dan Native Android (Kotlin).',
            'avatar' => '/images/avatar.jpg',
            'email' => 'satriabahari@gmail.com',
            'whatsapp' => '+6281234567890',
            'github' => 'https://github.com/satriabahari',
            'linkedin' => 'https://linkedin.com/in/satriabahari',
            'instagram' => 'https://instagram.com/satriabahari',
            'tiktok' => 'https://tiktok.com/@satriabahari',
            'is_verified' => true,
        ]);

        $skills = [
            ['name' => 'HTML5', 'icon_url' => 'https://cdn.simpleicons.org/html5', 'color' => '#E34F26'],
            ['name' => 'CSS3', 'icon_url' => 'https://cdn.simpleicons.org/css3', 'color' => '#1572B6'],
            ['name' => 'Bootstrap', 'icon_url' => 'https://cdn.simpleicons.org/bootstrap', 'color' => '#7952B3'],
            ['name' => 'Tailwind', 'icon_url' => 'https://cdn.simpleicons.org/tailwindcss', 'color' => '#06B6D4'],
            ['name' => 'JavaScript', 'icon_url' => 'https://cdn.simpleicons.org/javascript', 'color' => '#F7DF1E'],
            ['name' => 'TypeScript', 'icon_url' => 'https://cdn.simpleicons.org/typescript', 'color' => '#3178C6'],
            ['name' => 'React', 'icon_url' => 'https://cdn.simpleicons.org/react', 'color' => '#61DAFB'],
            ['name' => 'Next.js', 'icon_url' => 'https://cdn.simpleicons.org/nextdotjs', 'color' => '#333'],
            ['name' => 'Laravel', 'icon_url' => 'https://cdn.simpleicons.org/laravel', 'color' => '#FF2D20'],
            ['name' => 'Kotlin', 'icon_url' => 'https://cdn.simpleicons.org/kotlin', 'color' => '#7F52FF'],
            ['name' => 'Go', 'icon_url' => 'https://cdn.simpleicons.org/go', 'color' => '#00ADD8'],
            ['name' => 'MySQL', 'icon_url' => 'https://cdn.simpleicons.org/mysql', 'color' => '#4479A1'],
            ['name' => 'Docker', 'icon_url' => 'https://cdn.simpleicons.org/docker', 'color' => '#2496ED'],
            ['name' => 'GitHub', 'icon_url' => 'https://cdn.simpleicons.org/github', 'color' => '#333'],
        ];

        foreach ($skills as $i => $skill) {
            Skill::create(array_merge($skill, ['order' => $i]));
        }

        Experience::create([
            'title' => 'Backend Golang Developer',
            'company' => 'Pt. Affan Technology Indonesia (Parto.id)',
            'location' => 'Jambi, Indonesia',
            'start_date' => 'Jul 2025',
            'end_date' => 'Sep 2025',
            'duration' => '2 bulan',
            'type' => 'Internship',
            'work_mode' => 'Hybrid',
            'order' => 0,
        ]);

        Experience::create([
            'title' => 'Head of Technology',
            'company' => 'HIMASI UNJA',
            'location' => 'Jambi, Indonesia',
            'start_date' => 'Dec 2024',
            'end_date' => 'Dec 2025',
            'duration' => '1 tahun',
            'type' => 'Part-time',
            'work_mode' => 'Onsite',
            'order' => 1,
        ]);

        Project::create([
            'title' => 'satriabahari.my.id',
            'description' => 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind CSS.',
            'thumbnail' => '/images/projects/portfolio.png',
            'tech_stack' => ['TypeScript', 'Tailwind', 'React', 'Next.js'],
            'is_featured' => true,
            'order' => 0,
        ]);

        Project::create([
            'title' => 'Presence Internal System',
            'description' => 'Custom-built attendance tracking backend developed for internal use at Parto ID. Built using Golang.',
            'thumbnail' => '/images/projects/presence.png',
            'tech_stack' => ['Go'],
            'is_featured' => false,
            'order' => 1,
        ]);

        Achievement::create([
            'title' => 'Backend Developer Internship - Parto.id',
            'issuer' => 'Affan Technology Indonesia',
            'credential_id' => '196/EKS/HCLGA/ATI/VIII/2025',
            'issued_date' => 'JULY 2025',
            'type' => 'Certificate',
            'category' => 'Backend',
        ]);
    }
}
