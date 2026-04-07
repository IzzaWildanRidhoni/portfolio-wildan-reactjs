<?php
// database/seeders/MessageSeeder.php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad@example.com',
                'message' => 'Halo! Saya tertarik dengan portofolio Anda. Apakah Anda open untuk proyek freelance?',
                'subject' => 'Penawaran Kolaborasi',
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'created_at' => now()->subDays(3),
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti@example.com',
                'message' => 'Website Anda sangat inspiratif! Bisa sharing tips tentang React & Laravel?',
                'subject' => 'Request Tips',
                'ip_address' => '192.168.1.101',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'read_at' => now()->subDay(),
                'created_at' => now()->subDays(5),
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'message' => 'Terima kasih atas kontennya! Saya sudah follow Instagram dan GitHub Anda. 🙌',
                'subject' => null,
                'ip_address' => '192.168.1.102',
                'user_agent' => 'Mozilla/5.0 (Linux; Android 13)',
                'created_at' => now()->subHours(12),
            ],
        ];

        foreach ($messages as $msg) {
            Message::create($msg);
        }
    }
}
