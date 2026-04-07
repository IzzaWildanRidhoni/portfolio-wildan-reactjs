<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        Profile::create([
            'name'       => 'Izza Wildan',
            'username'   => 'izzawildan',
            'title'      => 'Software Engineer',
            'location'   => 'Jambi, Indonesia',
            'work_type'  => 'Onsite',
            'bio'        => 'Seorang Software Engineer dan kreator konten coding yang berdedikasi untuk membangun solusi digital yang berdampak. Saya spesialis dalam pengembangan platform web yang skalabel dan aplikasi mobile menggunakan tech stack modern, terutama Next.js, TypeScript, dan Native Android (Kotlin).',
            'avatar'     => '/images/avatar.jpg',
            'email'      => 'izzawildan@gmail.com',
            'whatsapp'   => '+6281234567890',
            'github'     => 'https://github.com/izzawildan',
            'linkedin'   => 'https://linkedin.com/in/izzawildan',
            'instagram'  => 'https://instagram.com/izzawildan',
            'tiktok'     => 'https://tiktok.com/@izzawildan',
            'is_verified' => true,
        ]);
    }
}
