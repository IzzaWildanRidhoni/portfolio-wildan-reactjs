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
            'name' => 'Izza Wildan ',
            'username' => 'izzawildan',
            'title' => 'Software Engineer',
            'location' => 'Jambi, Indonesia',
            'work_type' => 'Onsite',
            'bio' => 'Seorang Software Engineer dan kreator konten coding yang berdedikasi untuk membangun solusi digital yang berdampak. Saya spesialis dalam pengembangan platform web yang skalabel dan aplikasi mobile menggunakan tech stack modern, terutama Next.js, TypeScript, dan Native Android (Kotlin).',
            'avatar' => '/images/avatar.jpg',
            'email' => 'izzawildan@gmail.com',
            'whatsapp' => '+6281234567890',
            'github' => 'https://github.com/izzawildan',
            'linkedin' => 'https://linkedin.com/in/izzawildan',
            'instagram' => 'https://instagram.com/izzawildan',
            'tiktok' => 'https://tiktok.com/@izzawildan',
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
            'title' => 'Fullstack Developer',
            'company' => 'Pt. Git Solution',
            'location' => 'Yogyakarta, Indonesia',
            'start_date' => 'Januari 2019',
            'end_date' => 'Mei 2019',
            'duration' => '4 bulan',
            'type' => 'Internship',
            'work_mode' => 'Onsite',
            'order' => 0,
        ]);

        Experience::create([
            'title' => 'Fullstack Developer ',
            'company' => 'PT Baracipta Esa Engineering',
            'location' => 'Yogyakarta, Indonesia',
            'start_date' => 'Juli 2023',
            'end_date' => 'Desember 2023',
            'duration' => '6 Bulan',
            'type' => 'Internship',
            'work_mode' => 'Onsite',
            'order' => 1,
        ]);

        Project::create([
            'title' => 'izzawildan.my.id',
            'description' => 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind CSS.',
            'thumbnail' => '/images/projects/portfolio.png',
            'tech_stack' => ['TypeScript', 'Tailwind', 'React', 'Next.js'],
            'is_featured' => true,
            'order' => 0,
        ]);

        Project::create([
            'title'       => 'izzawildan.my.id',
            'description' => 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind CSS.',
            'thumbnail'   => null,
            'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'express', 'supabase'],
            'is_featured' => true,
            'demo_url'    => 'https://izzawildan.my.id',
            'repo_url'    => null,
            'order'       => 0,
        ]);

        Project::create([
            'title'       => 'Presence Internal System',
            'description' => 'The Presence Internal System is a custom-built attendance tracking backend developed for internal use at Parto ID. Built using Golang.',
            'thumbnail'   => null,
            'tech_stack'  => ['go'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 1,
        ]);

        Project::create([
            'title'       => 'Berbagi.link',
            'description' => 'Berbagi.link is a mini-website platform for online businesses but lacks mobile functionality.',
            'thumbnail'   => null,
            'tech_stack'  => ['kotlin'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 2,
        ]);

        Project::create([
            'title'       => 'Robust',
            'description' => 'Robust Fitness is a platform designed to help users achieve their fitness goals effectively.',
            'thumbnail'   => null,
            'tech_stack'  => ['php', 'tailwindcss', 'mysql'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 3,
        ]);

        Project::create([
            'title'       => 'Digital Business',
            'description' => 'Revolutionize your business with our digital solutions, offering innovative services for modern enterprises.',
            'thumbnail'   => null,
            'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'astro'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 4,
        ]);

        Project::create([
            'title'       => 'TechCult',
            'description' => 'Discover the rich and diverse culture of Indonesia through our site. From mesmerizing traditions to modern innovations.',
            'thumbnail'   => null,
            'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'nextdotjs'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 5,
        ]);

        Project::create([
            'title'       => 'Astronesia',
            'description' => 'The Astronesia school website, as a final project for a software engineering course.',
            'thumbnail'   => null,
            'tech_stack'  => ['javascript', 'tailwindcss', 'react', 'nextdotjs', 'astro', 'mysql'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 6,
        ]);

        Project::create([
            'title'       => 'Inventory Smart',
            'description' => 'Inventory Smart is an advanced inventory management solution designed to streamline stock operations.',
            'thumbnail'   => null,
            'tech_stack'  => ['php', 'tailwindcss', 'mysql'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 7,
        ]);

        Project::create([
            'title'       => 'Portfolio',
            'description' => 'Personal website & portfolio, built from scratch using Next.js, Typescript, and Tailwind CSS.',
            'thumbnail'   => null,
            'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'astro'],
            'is_featured' => false,
            'demo_url'    => null,
            'repo_url'    => null,
            'order'       => 8,
        ]);

        Achievement::create([
            'title'          => 'Backend Developer Internship - Parto.id',
            'issuer'         => 'Affan Technology Indonesia',
            'credential_id'  => '196/EKS/HCLGA/ATI/VIII/2025',
            'issued_date'    => 'JULY 2025',
            'type'           => 'Profesional',
            'category'       => 'Backend',
        ]);

        Achievement::create([
            'title'          => 'E-book Petunjuk Pro: Freelance Web Developer & Kerja Remote',
            'issuer'         => 'Build With Angga',
            'credential_id'  => null,
            'issued_date'    => 'SEPTEMBER 2025',
            'type'           => 'Course',
            'category'       => 'Freelance',
        ]);

        Achievement::create([
            'title'          => 'Belajar Membuat Aplikasi Android dengan Jetpack Compose',
            'issuer'         => 'Dicoding Indonesia',
            'credential_id'  => '81P2LGL38ZOY',
            'issued_date'    => 'JANUARY 2025',
            'type'           => 'Course',
            'category'       => 'Mobile',
        ]);

        Achievement::create([
            'title'          => 'Bangkit Academy 2024 by Google',
            'issuer'         => 'Bangkit Academy',
            'credential_id'  => 'BANGKIT-2024-001',
            'issued_date'    => 'DECEMBER 2024',
            'type'           => 'Certificate',
            'category'       => 'Mobile',
        ]);

        Achievement::create([
            'title'          => 'Google UX Design Certificate',
            'issuer'         => 'Google / Coursera',
            'credential_id'  => 'GOOGLE-UX-2024',
            'issued_date'    => 'NOVEMBER 2024',
            'type'           => 'Certificate',
            'category'       => 'Design',
        ]);

        Achievement::create([
            'title'          => 'Belajar Pengembangan Web Frontend Expert',
            'issuer'         => 'Dicoding Indonesia',
            'credential_id'  => 'DICODING-FE-EXP',
            'issued_date'    => 'OCTOBER 2024',
            'type'           => 'Course',
            'category'       => 'Frontend',
        ]);

        Achievement::create([
            'title'          => 'React - The Complete Guide 2024',
            'issuer'         => 'Udemy / Maximilian Schwarzmüller',
            'credential_id'  => 'UDEMY-REACT-2024',
            'issued_date'    => 'AUGUST 2024',
            'type'           => 'Course',
            'category'       => 'Frontend',
        ]);

        Achievement::create([
            'title'          => 'AWS Cloud Practitioner Essentials',
            'issuer'         => 'Amazon Web Services',
            'credential_id'  => 'AWS-CPE-2024',
            'issued_date'    => 'JULY 2024',
            'type'           => 'Certificate',
            'category'       => 'DevOps',
        ]);

        Achievement::create([
            'title'          => 'Belajar Dasar Git dengan GitHub',
            'issuer'         => 'Dicoding Indonesia',
            'credential_id'  => 'DICODING-GIT',
            'issued_date'    => 'JUNE 2024',
            'type'           => 'Course',
            'category'       => 'Backend',
        ]);
    }
}
