<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title'       => 'izzawildan.my.id',
                'description' => 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind CSS.',
                'thumbnail'   => '/images/projects/portfolio.png',
                'tech_stack'  => ['TypeScript', 'Tailwind', 'React', 'Next.js'],
                'is_featured' => true,
                'order'       => 0,
            ],
            [
                'title'       => 'izzawildan.my.id',
                'description' => 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind CSS.',
                'thumbnail'   => null,
                'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'express', 'supabase'],
                'is_featured' => true,
                'demo_url'    => 'https://izzawildan.my.id',
                'repo_url'    => null,
                'order'       => 0,
            ],
            [
                'title'       => 'Presence Internal System',
                'description' => 'The Presence Internal System is a custom-built attendance tracking backend developed for internal use at Parto ID. Built using Golang.',
                'thumbnail'   => null,
                'tech_stack'  => ['go'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 1,
            ],
            [
                'title'       => 'Berbagi.link',
                'description' => 'Berbagi.link is a mini-website platform for online businesses but lacks mobile functionality.',
                'thumbnail'   => null,
                'tech_stack'  => ['kotlin'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 2,
            ],
            [
                'title'       => 'Robust',
                'description' => 'Robust Fitness is a platform designed to help users achieve their fitness goals effectively.',
                'thumbnail'   => null,
                'tech_stack'  => ['php', 'tailwindcss', 'mysql'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 3,
            ],
            [
                'title'       => 'Digital Business',
                'description' => 'Revolutionize your business with our digital solutions, offering innovative services for modern enterprises.',
                'thumbnail'   => null,
                'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'astro'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 4,
            ],
            [
                'title'       => 'TechCult',
                'description' => 'Discover the rich and diverse culture of Indonesia through our site. From mesmerizing traditions to modern innovations.',
                'thumbnail'   => null,
                'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'nextdotjs'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 5,
            ],
            [
                'title'       => 'Astronesia',
                'description' => 'The Astronesia school website, as a final project for a software engineering course.',
                'thumbnail'   => null,
                'tech_stack'  => ['javascript', 'tailwindcss', 'react', 'nextdotjs', 'astro', 'mysql'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 6,
            ],
            [
                'title'       => 'Inventory Smart',
                'description' => 'Inventory Smart is an advanced inventory management solution designed to streamline stock operations.',
                'thumbnail'   => null,
                'tech_stack'  => ['php', 'tailwindcss', 'mysql'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 7,
            ],
            [
                'title'       => 'Portfolio',
                'description' => 'Personal website & portfolio, built from scratch using Next.js, Typescript, and Tailwind CSS.',
                'thumbnail'   => null,
                'tech_stack'  => ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'astro'],
                'is_featured' => false,
                'demo_url'    => null,
                'repo_url'    => null,
                'order'       => 8,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
