<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Education;

class EducationSeeder extends Seeder
{
    public function run(): void
    {
        $educations = [
            [
                'institution' => 'IST AKPRIND YOGYAKARTA',
                'logo'        => null,
                'degree'      => "Bachelor's degree",
                'field'       => 'Information Systems, (S.Kom)',
                'gpa'         => '3.80/4.00',
                'start_year'  => '2022',
                'end_year'    => '2026',
                'location'    => 'Yogyakarta, Indonesia',
                'order'       => 0,
            ],
            [
                'institution' => 'SMK TEMBARAK',
                'logo'        => null,
                'degree'      => 'Senior High School',
                'field'       => 'Science',
                'gpa'         => null,
                'start_year'  => '2019',
                'end_year'    => '2022',
                'location'    => 'Temanggung, Indonesia',
                'order'       => 1,
            ],
        ];

        foreach ($educations as $edu) {
            Education::create($edu);
        }
    }
}
