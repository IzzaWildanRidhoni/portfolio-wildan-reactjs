import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { HomePageSkeleton } from '@/Components/Skeleton';
import { MapPin, Monitor } from 'lucide-react';

const staticSkills = [
    { id: 1,  name: 'HTML5',      slug: 'html5',       color: '#E34F26' },
    { id: 2,  name: 'CSS3',       slug: 'css3',         color: '#1572B6' },
    { id: 3,  name: 'Bootstrap',  slug: 'bootstrap',    color: '#7952B3' },
    { id: 4,  name: 'Tailwind',   slug: 'tailwindcss',  color: '#06B6D4' },
    { id: 5,  name: 'JavaScript', slug: 'javascript',   color: '#F7DF1E' },
    { id: 6,  name: 'TypeScript', slug: 'typescript',   color: '#3178C6' },
    { id: 7,  name: 'React',      slug: 'react',        color: '#61DAFB' },
    { id: 8,  name: 'Vue.js',     slug: 'vuedotjs',     color: '#4FC08D' },
    { id: 9,  name: 'Astro',      slug: 'astro',        color: '#FF5D01' },
    { id: 10, name: 'Next.js',    slug: 'nextdotjs',    color: '#fff' },
    { id: 11, name: 'Vite',       slug: 'vite',         color: '#646CFF' },
    { id: 12, name: 'Nuxt',       slug: 'nuxtdotjs',    color: '#00DC82' },
    { id: 13, name: 'Svelte',     slug: 'svelte',       color: '#FF3E00' },
    { id: 14, name: 'Redux',      slug: 'redux',        color: '#764ABC' },
    { id: 15, name: 'Prisma',     slug: 'prisma',       color: '#2D3748' },
    { id: 16, name: 'MobX',       slug: 'mobx',         color: '#FF9955' },
    { id: 17, name: 'Gatsby',     slug: 'gatsby',       color: '#663399' },
    { id: 18, name: 'Next.js',    slug: 'nextdotjs',    color: '#fff' },
    { id: 19, name: 'Figma',      slug: 'figma',        color: '#F24E1E' },
    { id: 20, name: 'Shopify',    slug: 'shopify',      color: '#96BF48' },
    { id: 21, name: 'WooComm.',   slug: 'woocommerce',  color: '#7F54B3' },
    { id: 22, name: 'Strapi',     slug: 'strapi',       color: '#2F2E8B' },
    { id: 23, name: 'Payload',    slug: 'payloadcms',   color: '#fff' },
    { id: 24, name: 'Sanity',     slug: 'sanity',       color: '#F03E2F' },
    { id: 25, name: 'Supabase',   slug: 'supabase',     color: '#3ECF8E' },
    { id: 26, name: 'Firebase',   slug: 'firebase',     color: '#FFCA28' },
    { id: 27, name: 'Golang',     slug: 'go',           color: '#00ADD8' },
    { id: 28, name: 'Laravel',    slug: 'laravel',      color: '#FF2D20' },
    { id: 29, name: 'Kotlin',     slug: 'kotlin',       color: '#7F52FF' },
    { id: 30, name: 'Express',    slug: 'express',      color: '#fff' },
    { id: 31, name: 'PHP',        slug: 'php',          color: '#777BB4' },
    { id: 32, name: 'Node.js',    slug: 'nodedotjs',    color: '#339933' },
    { id: 33, name: 'MySQL',      slug: 'mysql',        color: '#4479A1' },
    { id: 34, name: 'Supabase',   slug: 'supabase',     color: '#3ECF8E' },
    { id: 35, name: 'Docker',     slug: 'docker',       color: '#2496ED' },
    { id: 36, name: 'npm',        slug: 'npm',          color: '#CB3837' },
    { id: 37, name: 'GitHub',     slug: 'github',       color: '#fff' },
];

export default function Home({ profile, skills }) {
    const [loading, setLoading] = useState(true);

    const displaySkills = skills?.length ? skills : staticSkills;
    const displayProfile = profile || {
        name: 'Satria Bahari',
        location: 'Jambi, Indonesia',
        work_type: 'Onsite',
        bio: 'Seorang Software Engineer dan kreator konten coding yang berdedikasi untuk membangun solusi digital yang berdampak. Saya spesialis dalam pengembangan platform web yang skalabel dan aplikasi mobile menggunakan tech stack modern, terutama Next.js, TypeScript, dan Native Android (Kotlin).',
        bio2: 'Fokus saya adalah merancang arsitektur perangkat lunak yang terstruktur dengan baik, mudah dipelihara, dan selaras dengan tujuan bisnis. Saya memadukan keahlian teknis dengan komunikasi proaktif dan kepemimpinan untuk memastikan setiap proyek memberikan kejelasan logis dan dampak nyata di dunia nyata.',
    };

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    if (loading) {
        return <MainLayout><HomePageSkeleton /></MainLayout>;
    }

    return (
        <MainLayout>
            <div className="space-y-8">

                {/* ── HERO ── */}
                <div>
                    <h1 className="text-[28px] font-bold text-white mb-3 tracking-tight">
                        Halo, saya {displayProfile.name}
                    </h1>

                    {/* Location + work type */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-white/45 mb-5">
                        <div className="flex items-center gap-1.5">
                            <span className="text-white/30">•</span>
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Berdomisili di {displayProfile.location}</span>
                            <span className="inline-flex items-center justify-center w-4 h-3.5 rounded-[2px] bg-blue-600 text-white text-[9px] font-bold leading-none">ID</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-white/30">•</span>
                            <Monitor className="w-3.5 h-3.5" />
                            <span>{displayProfile.work_type}</span>
                        </div>
                    </div>

                    {/* Bio paragraphs */}
                    <div className="space-y-4 text-[13.5px] text-white/60 leading-[1.75]">
                        <p>{displayProfile.bio}</p>
                        <p>{displayProfile.bio2 || ''}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.07]" />

                {/* ── SKILLS ── */}
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[13px] text-white/40 font-mono">&lt;/&gt;</span>
                        <h2 className="text-[18px] font-bold text-white tracking-tight">Keahlian</h2>
                    </div>
                    <p className="text-[13px] text-white/40 mb-6">Keahlian profesional saya.</p>

                    {/* Grid of skill icons */}
                    <div className="flex flex-wrap gap-[10px]">
                        {displaySkills.map((skill) => (
                            <div key={skill.id} className="group relative">
                                <div
                                    className="w-[50px] h-[50px] rounded-full flex items-center justify-center border border-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-default hover:scale-110"
                                    style={{ backgroundColor: (skill.color || '#fff') + '18' }}
                                >
                                    <img
                                        src={`https://cdn.simpleicons.org/${skill.slug || skill.name.toLowerCase()}`}
                                        alt={skill.name}
                                        className="w-6 h-6 object-contain"
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                {/* Tooltip */}
                                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1f1f1f] border border-white/10 text-[11px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    {skill.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* GitHub icon row */}
                    <div className="mt-4">
                        <div className="group relative inline-block">
                            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center border border-white/[0.08] hover:border-white/20 bg-white/[0.04] transition-all duration-200 cursor-default hover:scale-110">
                                <img
                                    src="https://cdn.simpleicons.org/github/ffffff"
                                    alt="GitHub"
                                    className="w-6 h-6 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}