<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $staticSkills = [
            ['id' => 1,  'name' => 'HTML5',      'slug' => 'html5',                'color' => 'E34F26'],
            // ['id' => 2,  'name' => 'CSS3',       'slug' => 'css3',                 'color' => '1572B6'],
            ['id' => 3,  'name' => 'Bootstrap',  'slug' => 'bootstrap',            'color' => '7952B3'],
            ['id' => 4,  'name' => 'Tailwind',   'slug' => 'tailwindcss',          'color' => '06B6D4'],
            ['id' => 5,  'name' => 'JavaScript', 'slug' => 'javascript',           'color' => 'F7DF1E'],
            ['id' => 6,  'name' => 'TypeScript', 'slug' => 'typescript',           'color' => '3178C6'],
            ['id' => 7,  'name' => 'React',      'slug' => 'react',                'color' => '61DAFB'],
            ['id' => 8,  'name' => 'Vue.js',     'slug' => 'vuedotjs',             'color' => '4FC08D'],
            ['id' => 9,  'name' => 'Next.js',    'slug' => 'nextdotjs',            'color' => 'ffffff'],
            // ['id' => 10, 'name' => 'Nuxt',       'slug' => 'nuxtdotjs',            'color' => '00DC82'],
            ['id' => 11, 'name' => 'Svelte',     'slug' => 'svelte',               'color' => 'FF3E00'],
            ['id' => 12, 'name' => 'Redux',      'slug' => 'redux',                'color' => '764ABC'],
            ['id' => 13, 'name' => 'Figma',      'slug' => 'figma',                'color' => 'F24E1E'],
            ['id' => 14, 'name' => 'Vite',       'slug' => 'vite',                 'color' => '646CFF'],
            ['id' => 15, 'name' => 'Gatsby',     'slug' => 'gatsby',               'color' => '663399'],
            ['id' => 16, 'name' => 'Prisma',     'slug' => 'prisma',               'color' => 'ffffff'],
            ['id' => 17, 'name' => 'Shopify',    'slug' => 'shopify',              'color' => '96BF48'],
            ['id' => 18, 'name' => 'Strapi',     'slug' => 'strapi',               'color' => '4945FF'],
            ['id' => 19, 'name' => 'Supabase',   'slug' => 'supabase',             'color' => '3ECF8E'],
            ['id' => 20, 'name' => 'Firebase',   'slug' => 'firebase',             'color' => 'FFCA28'],
            ['id' => 21, 'name' => 'Go',         'slug' => 'go',                   'color' => '00ADD8'],
            ['id' => 22, 'name' => 'Laravel',    'slug' => 'laravel',              'color' => 'FF2D20'],
            ['id' => 23, 'name' => 'Kotlin',     'slug' => 'kotlin',               'color' => '7F52FF'],
            ['id' => 24, 'name' => 'Express',    'slug' => 'express',              'color' => 'ffffff'],
            ['id' => 25, 'name' => 'PHP',        'slug' => 'php',                  'color' => '777BB4'],
            ['id' => 26, 'name' => 'Node.js',    'slug' => 'nodedotjs',            'color' => '339933'],
            ['id' => 27, 'name' => 'MySQL',      'slug' => 'mysql',                'color' => '4479A1'],
            ['id' => 28, 'name' => 'Docker',     'slug' => 'docker',               'color' => '2496ED'],
            ['id' => 29, 'name' => 'GitHub',     'slug' => 'github',               'color' => 'ffffff'],
            ['id' => 30, 'name' => 'npm',        'slug' => 'npm',                  'color' => 'CB3837'],
            ['id' => 31, 'name' => 'MongoDB',    'slug' => 'mongodb',              'color' => '47A248'],
            ['id' => 32, 'name' => 'PostgreSQL', 'slug' => 'postgresql',           'color' => '4169E1'],
            ['id' => 33, 'name' => 'Redis',      'slug' => 'redis',                'color' => 'FF4438'],
            ['id' => 34, 'name' => 'GraphQL',    'slug' => 'graphql',              'color' => 'E10098'],
            ['id' => 35, 'name' => 'Linux',      'slug' => 'linux',                'color' => 'FCC624'],
            ['id' => 36, 'name' => 'Git',        'slug' => 'git',                  'color' => 'F05032'],
            ['id' => 37, 'name' => 'Nginx',      'slug' => 'nginx',                'color' => '009639'],
        ];

        foreach ($staticSkills as $index => $skill) {
            Skill::create([
                'name'      => $skill['name'],
                'icon_url'  => "https://cdn.simpleicons.org/{$skill['slug']}",
                'color'     => "#{$skill['color']}",
                'order'     => $index,
            ]);
        }
    }
}
