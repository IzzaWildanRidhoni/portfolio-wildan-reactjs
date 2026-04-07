<?php
// database/seeders/SocialLinkSeeder.php

namespace Database\Seeders;

use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class SocialLinkSeeder extends Seeder
{
    public function run(): void
    {
        $links = [
            [
                'platform' => 'email',
                'label' => 'Tetap Terhubung',
                'description' => 'Hubungi saya melalui email untuk pertanyaan atau kolaborasi.',
                'url' => 'mailto:izzawildan@gmail.com',
                'icon_class' => 'email-icon',
                'gradient' => 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
                'is_active' => true,
                'sort_order' => 1,
                'is_full_width' => true,
                'button_text' => 'Pergi ke Gmail',
            ],
            [
                'platform' => 'instagram',
                'label' => 'Ikuti Perjalanan Saya',
                'description' => 'Ikuti perjalanan kreatif saya.',
                'url' => 'https://instagram.com/izzawildan',
                'gradient' => 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                'is_active' => true,
                'sort_order' => 2,
                'is_full_width' => false,
                'button_text' => 'Pergi ke Instagram',
            ],
            [
                'platform' => 'linkedin',
                'label' => 'Mari Terhubung',
                'description' => 'Terhubung dengan saya secara profesional.',
                'url' => 'https://linkedin.com/in/izzawildan',
                'gradient' => 'linear-gradient(135deg, #0277bd 0%, #01579b 100%)',
                'is_active' => true,
                'sort_order' => 3,
                'is_full_width' => false,
                'button_text' => 'Pergi ke Linkedin',
            ],
            [
                'platform' => 'github',
                'label' => 'Jelajahi Kode',
                'description' => 'Jelajahi karya sumber terbuka saya.',
                'url' => 'https://github.com/izzawildan',
                'gradient' => 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
                'is_active' => true,
                'sort_order' => 4,
                'is_full_width' => false,
                'button_text' => 'Pergi ke Github',
            ],
            [
                'platform' => 'tiktok',
                'label' => 'Bergabung dalam Keseruan',
                'description' => 'Tonton konten yang menarik dan menyenangkan.',
                'url' => 'https://tiktok.com/@izzawildan',
                'gradient' => 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
                'icon_class' => 'tiktok-icon',
                'is_active' => true,
                'sort_order' => 5,
                'is_full_width' => false,
                'button_text' => 'Pergi ke Tiktok',
            ],
            [
                'platform' => 'whatsapp',
                'label' => 'Chat via WhatsApp',
                'description' => 'Hubungi saya langsung melalui WhatsApp.',
                'url' => 'https://wa.me/6281234567890',
                'gradient' => 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                'is_active' => false, // Nonaktifkan jika belum ingin ditampilkan
                'sort_order' => 6,
                'is_full_width' => false,
                'button_text' => 'Chat WhatsApp',
            ],
        ];

        foreach ($links as $link) {
            SocialLink::create($link);
        }
    }
}
