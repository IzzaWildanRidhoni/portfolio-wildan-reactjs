<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data admin default
        $admins = [
            [
                'name'      => 'Super Admin',
                'email'     => 'admin@gmail.com',
                'password'  => Hash::make('password'),
                'remember_token' => Str::random(10),
            ],
            // Tambahkan admin lain jika diperlukan:
            // [
            //     'name'      => 'Manager',
            //     'email'     => 'manager@example.com',
            //     'password'  => Hash::make('manager123'),
            //     'remember_token' => Str::random(10),
            // ],
        ];

        foreach ($admins as $admin) {
            // Cek apakah admin sudah ada berdasarkan email
            Admin::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name'           => $admin['name'],
                    'password'       => $admin['password'],
                    'remember_token' => $admin['remember_token'],
                ]
            );
        }

        $this->command->info('✅ Admin default berhasil dibuat!');
        $this->command->warn('📧 Email: admin@gmail.com');
        $this->command->warn('🔑 Password: password');
    }
}
