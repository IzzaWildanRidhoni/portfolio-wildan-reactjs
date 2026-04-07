import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { HomePageSkeleton } from '@/Components/Skeleton';
import { MapPin, Monitor, Rocket, ArrowRight } from 'lucide-react';

// Pakai simpleicons CDN — sudah terbukti jalan di project ini sebelumnya
// Format URL: https://cdn.simpleicons.org/{slug}/{hex-color}
const staticSkills = [
    { id: 1,  name: 'HTML5',      slug: 'html5',                color: 'E34F26' },
    // { id: 2,  name: 'CSS3',       slug: 'css3',                 color: '1572B6' },
    { id: 3,  name: 'Bootstrap',  slug: 'bootstrap',            color: '7952B3' },
    { id: 4,  name: 'Tailwind',   slug: 'tailwindcss',          color: '06B6D4' },
    { id: 5,  name: 'JavaScript', slug: 'javascript',           color: 'F7DF1E' },
    { id: 6,  name: 'TypeScript', slug: 'typescript',           color: '3178C6' },
    { id: 7,  name: 'React',      slug: 'react',                color: '61DAFB' },
    { id: 8,  name: 'Vue.js',     slug: 'vuedotjs',             color: '4FC08D' },
    { id: 9,  name: 'Next.js',    slug: 'nextdotjs',            color: 'ffffff' },
    // { id: 10, name: 'Nuxt',       slug: 'nuxtdotjs',            color: '00DC82' },
    { id: 11, name: 'Svelte',     slug: 'svelte',               color: 'FF3E00' },
    { id: 12, name: 'Redux',      slug: 'redux',                color: '764ABC' },
    { id: 13, name: 'Figma',      slug: 'figma',                color: 'F24E1E' },
    { id: 14, name: 'Vite',       slug: 'vite',                 color: '646CFF' },
    { id: 15, name: 'Gatsby',     slug: 'gatsby',               color: '663399' },
    { id: 16, name: 'Prisma',     slug: 'prisma',               color: 'ffffff' },
    { id: 17, name: 'Shopify',    slug: 'shopify',              color: '96BF48' },
    { id: 18, name: 'Strapi',     slug: 'strapi',               color: '4945FF' },
    { id: 19, name: 'Supabase',   slug: 'supabase',             color: '3ECF8E' },
    { id: 20, name: 'Firebase',   slug: 'firebase',             color: 'FFCA28' },
    { id: 21, name: 'Go',         slug: 'go',                   color: '00ADD8' },
    { id: 22, name: 'Laravel',    slug: 'laravel',              color: 'FF2D20' },
    { id: 23, name: 'Kotlin',     slug: 'kotlin',               color: '7F52FF' },
    { id: 24, name: 'Express',    slug: 'express',              color: 'ffffff' },
    { id: 25, name: 'PHP',        slug: 'php',                  color: '777BB4' },
    { id: 26, name: 'Node.js',    slug: 'nodedotjs',            color: '339933' },
    { id: 27, name: 'MySQL',      slug: 'mysql',                color: '4479A1' },
    { id: 28, name: 'Docker',     slug: 'docker',               color: '2496ED' },
    { id: 29, name: 'GitHub',     slug: 'github',               color: 'ffffff' },
    { id: 30, name: 'npm',        slug: 'npm',                  color: 'CB3837' },
    { id: 31, name: 'MongoDB',    slug: 'mongodb',              color: '47A248' },
    { id: 32, name: 'PostgreSQL', slug: 'postgresql',           color: '4169E1' },
    { id: 33, name: 'Redis',      slug: 'redis',                color: 'FF4438' },
    { id: 34, name: 'GraphQL',    slug: 'graphql',              color: 'E10098' },
    { id: 35, name: 'Linux',      slug: 'linux',                color: 'FCC624' },
    { id: 36, name: 'Git',        slug: 'git',                  color: 'F05032' },
    { id: 37, name: 'Nginx',      slug: 'nginx',                color: '009639' },
];

const marqueeStyles = `
    @keyframes marquee-left {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    @keyframes marquee-right {
        0%   { transform: translateX(-50%); }
        100% { transform: translateX(0); }
    }
`;

function SkillItem({ skill }) {
    // background = warna icon dengan opacity rendah
    const bg = `#${skill.color}18`;

    return (
        <div className="group relative mx-[6px] flex-shrink-0">
            <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center border border-white/[0.08] group-hover:border-white/20 transition-all duration-200 cursor-default group-hover:scale-110"
                style={{ backgroundColor: bg }}
            >
                <img
                    src={`https://cdn.simpleicons.org/${skill.slug}/${skill.color}`}
                    alt={skill.name}
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none'; }}
                />
            </div>
            {/* Tooltip */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1f1f1f] border border-white/10 text-[11px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                {skill.name}
            </div>
        </div>
    );
}
function MarqueeRow({ skills, direction = 'left', speed = 40 }) {
    const items = [...skills, ...skills];
    const animationName = direction === 'right' ? 'marquee-right' : 'marquee-left';

    return (
        <div
            className="relative overflow-hidden py-1 w-full"
            style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
        >
            <div
                className="flex w-max"
                style={{ 
                    animation: `${animationName} ${speed}s linear infinite`,
                    willChange: 'transform' // Optimasi performa animasi
                }}
                onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
                onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
            >
                {items.map((skill, idx) => (
                    <SkillItem key={`${direction}-${skill.id}-${idx}`} skill={skill} />
                ))}
            </div>
        </div>
    );
}

// Tambahkan overflow-x-hidden pada container utama Home
export default function Home({ profile, skills }) {
    const [loading, setLoading] = useState(true);

    const displaySkills = staticSkills;
    const displayProfile = {
        name: 'Izza Wildan Ridhoni',
        work_type: 'Onsite',
        bio: 'Seorang Fullstack Web Developer yang berfokus pada pengembangan aplikasi web modern dan scalable menggunakan Laravel sebagai backend dan React JS sebagai frontend. Berpengalaman dalam membangun sistem end-to-end dengan arsitektur yang rapi, performa optimal, dan user experience yang baik',
        bio2: 'Fokus saya adalah merancang arsitektur perangkat lunak yang terstruktur dengan baik, mudah dipelihara, dan selaras dengan tujuan bisnis.',
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
            <style>{marqueeStyles}</style>

            {/* ── WRAPPER UTAMA DENGAN overflow-x-hidden ── */}
            <div className="space-y-8 w-full overflow-x-hidden">

                {/* ── HERO ─ */}
                <div className="w-full">
                    <h1 className="text-[28px] font-bold text-white mb-3 tracking-tight">
                        Halo, saya {displayProfile.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-white/45 mb-5">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Temanggung, Jawa Tengah</span>
                            <span className="inline-flex items-center justify-center w-4 h-3.5 rounded-[2px] bg-blue-600 text-white text-[9px] font-bold leading-none">ID</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-white/30">•</span>
                            <Monitor className="w-3.5 h-3.5" />
                            <span>{displayProfile.work_type}</span>
                        </div>
                    </div>

                    <div className="space-y-4 text-[13.5px] text-white/60 leading-[1.75]">
                        <p>{displayProfile.bio}</p>
                        <p>{displayProfile.bio2}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.07]" />

                {/* ── SKILLS ── */}
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[13px] text-white/40 font-mono">&lt;/&gt;</span>
                        <h2 className="text-[18px] font-bold text-white tracking-tight">Keahlian</h2>
                    </div>
                    <p className="text-[13px] text-white/40 mb-6">Keahlian profesional saya.</p>

                    {/* Container marquee dengan overflow terkontrol */}
                    <div className="w-full overflow-hidden -mx-1">
                        <div className="space-y-3">
                            {/* Baris 1 — bergerak ke kanan */}
                            <MarqueeRow skills={displaySkills} direction="left" speed={45} />
                            {/* Baris 2 — bergerak ke kiri */}
                            <MarqueeRow skills={displaySkills} direction="right" speed={45} />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.07]" />

                {/* ── WHAT I'VE BEEN WORKING ON ── */}
                <div className="w-full">
                    <h2 className="text-[18px] font-bold text-white tracking-tight mb-4">
                        What I've Been Working On
                    </h2>
                    
                    <p className="text-[13.5px] text-white/60 leading-[1.75] mb-6">
                        I assist brands, companies, institutions, and startups in creating exceptional digital experiences for their businesses through strategic development services.
                    </p>

                    {/* Contact Card */}
                    <div className="rounded-2xl bg-card/50 border border-white/[0.08] p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Rocket className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-semibold text-white mb-2">
                                    Lets work together!
                                </h3>
                                <p className="text-[13px] text-white/60 leading-[1.6]">
                                    I'm open for freelance projects, feel free to email me to see how can we collaborate.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/kontak"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            Contact me
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}