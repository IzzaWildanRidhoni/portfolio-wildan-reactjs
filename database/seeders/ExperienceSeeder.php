<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experience;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            [
                'title'       => 'Fullstack Developer',
                'company'     => 'Pt. Git Solution',
                'logo'        => null, // atau '/images/companies/git-solution.png'
                'location'    => 'Yogyakarta, Indonesia',
                'start_date'  => 'Januari 2019',
                'end_date'    => 'Mei 2019',
                'duration'    => '4 bulan',
                'type'        => 'Internship',
                'work_mode'   => 'Onsite',
                'description' => 'Bertanggung jawab dalam pengembangan fitur frontend dan backend, integrasi API, serta maintenance aplikasi internal perusahaan.',
                'order'       => 0,
            ],
            [
                'title'       => 'Fullstack Developer',
                'company'     => 'PT Baracipta Esa Engineering',
                'logo'        => null, // atau '/images/companies/baracipta.png'
                'location'    => 'Yogyakarta, Indonesia',
                'start_date'  => 'Juli 2023',
                'end_date'    => 'Desember 2023',
                'duration'    => '6 Bulan',
                'type'        => 'Internship',
                'work_mode'   => 'Onsite',
                'description' => 'Mengembangkan dan memelihara sistem internal perusahaan, kolaborasi dengan tim untuk deliver fitur baru, serta optimasi performa aplikasi.',
                'order'       => 1,
            ],
        ];

        foreach ($experiences as $exp) {
            Experience::create($exp);
        }
    }
}
