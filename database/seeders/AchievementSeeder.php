<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            [
                'title'         => 'Backend Developer Internship - Parto.id',
                'issuer'        => 'Affan Technology Indonesia',
                'credential_id' => '196/EKS/HCLGA/ATI/VIII/2025',
                'issued_date'   => 'JULY 2025',
                'type'          => 'Profesional',
                'category'      => 'Backend',
            ],
            [
                'title'         => 'E-book Petunjuk Pro: Freelance Web Developer & Kerja Remote',
                'issuer'        => 'Build With Angga',
                'credential_id' => null,
                'issued_date'   => 'SEPTEMBER 2025',
                'type'          => 'Course',
                'category'      => 'Freelance',
            ],
            [
                'title'         => 'Belajar Membuat Aplikasi Android dengan Jetpack Compose',
                'issuer'        => 'Dicoding Indonesia',
                'credential_id' => '81P2LGL38ZOY',
                'issued_date'   => 'JANUARY 2025',
                'type'          => 'Course',
                'category'      => 'Mobile',
            ],
            [
                'title'         => 'Bangkit Academy 2024 by Google',
                'issuer'        => 'Bangkit Academy',
                'credential_id' => 'BANGKIT-2024-001',
                'issued_date'   => 'DECEMBER 2024',
                'type'          => 'Certificate',
                'category'      => 'Mobile',
            ],
            [
                'title'         => 'Google UX Design Certificate',
                'issuer'        => 'Google / Coursera',
                'credential_id' => 'GOOGLE-UX-2024',
                'issued_date'   => 'NOVEMBER 2024',
                'type'          => 'Certificate',
                'category'      => 'Design',
            ],
            [
                'title'         => 'Belajar Pengembangan Web Frontend Expert',
                'issuer'        => 'Dicoding Indonesia',
                'credential_id' => 'DICODING-FE-EXP',
                'issued_date'   => 'OCTOBER 2024',
                'type'          => 'Course',
                'category'      => 'Frontend',
            ],
            [
                'title'         => 'React - The Complete Guide 2024',
                'issuer'        => 'Udemy / Maximilian Schwarzmüller',
                'credential_id' => 'UDEMY-REACT-2024',
                'issued_date'   => 'AUGUST 2024',
                'type'          => 'Course',
                'category'      => 'Frontend',
            ],
            [
                'title'         => 'AWS Cloud Practitioner Essentials',
                'issuer'        => 'Amazon Web Services',
                'credential_id' => 'AWS-CPE-2024',
                'issued_date'   => 'JULY 2024',
                'type'          => 'Certificate',
                'category'      => 'DevOps',
            ],
            [
                'title'         => 'Belajar Dasar Git dengan GitHub',
                'issuer'        => 'Dicoding Indonesia',
                'credential_id' => 'DICODING-GIT',
                'issued_date'   => 'JUNE 2024',
                'type'          => 'Course',
                'category'      => 'Backend',
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}
