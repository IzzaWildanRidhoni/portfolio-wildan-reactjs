import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { HomePageSkeleton } from '@/Components/Skeleton';
import { MapPin, Monitor, Rocket, ArrowRight } from 'lucide-react';

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
    // Handle color format: database menyimpan dengan '#', CDN butuh tanpa '#'
    const colorHex = skill.color?.replace('#', '') || 'ffffff';
    const bg = `#${colorHex}18`;
    
    // Prioritaskan icon_url dari DB, fallback ke CDN construction
    const iconUrl = skill.icon_url 
        ? `${skill.icon_url}/${colorHex}` 
        : `https://cdn.simpleicons.org/${skill.slug || skill.name.toLowerCase()}/${colorHex}`;

    return (
        <div className="group mx-[8px] flex-shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card/30 border border-white/[0.08] group-hover:border-white/20 transition-all duration-200 cursor-default group-hover:scale-105 group-hover:bg-card/50">
                {/* Icon */}
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: bg }}
                >
                    <img
                        src={iconUrl}
                        alt={skill.name}
                        className="w-5 h-5 object-contain"
                        loading="lazy"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                </div>
                
                {/* Tech Name */}
                <span className="text-[13px] font-medium text-white/80 whitespace-nowrap group-hover:text-white transition-colors duration-200">
                    {skill.name}
                </span>
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
                    willChange: 'transform'
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

export default function Home({ profile, skills }) {
    const [loading, setLoading] = useState(true);

    // Gunakan skills dari database, fallback ke empty array jika belum ada
    const displaySkills = skills && skills.length > 0 ? skills : [];

    const displayProfile = profile;


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

            <div className="space-y-8 w-full overflow-x-hidden">

                {/* ── HERO ── */}
                <div className="w-full">
                    <h1 className="text-[28px] font-bold text-white mb-3 tracking-tight">
                        Halo, saya {displayProfile.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-white/45 mb-5">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{displayProfile.location}</span>
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
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.07]" />

                {/* ── SKILLS ── */}
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-1.5">
                        {/* <span className="text-[13px] text-white/40 font-mono">&lt;/&gt;</span> */}
                        <h2 className="text-[18px] font-bold text-white tracking-tight">Keahlian</h2>
                    </div>
                    <p className="text-[13px] text-white/40 mb-6">Keahlian profesional saya.</p>

                    {/* Tampilkan marquee hanya jika ada skills */}
                    {displaySkills.length > 0 ? (
                        <div className="w-full overflow-hidden -mx-1">
                            <div className="space-y-3">
                                <MarqueeRow skills={displaySkills} direction="left" speed={100} />
                                <MarqueeRow skills={displaySkills} direction="right" speed={100} />
                            </div>
                        </div>
                    ) : (
                        <p className="text-[13px] text-white/40 italic">Belum ada keahlian yang ditambahkan.</p>
                    )}
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