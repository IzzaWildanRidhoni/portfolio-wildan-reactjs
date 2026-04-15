import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { AboutPageSkeleton } from '@/Components/Skeleton';
import { Briefcase, GraduationCap, ChevronRight, MapPin } from 'lucide-react';

function ExperienceCard({ exp, isLast }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative flex gap-4 mb-4">
           {/* Logo dengan Timeline */}
            <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center overflow-hidden">
                        {exp.logo ? (
                            <img 
                                src={exp.logo} 
                                alt={exp.company} 
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <Briefcase className="w-4 h-4 text-white/30" />
                        )}
                    </div>
                </div>
                
                {!isLast && (
                    <div className="w-px h-full bg-gradient-to-b from-white/20 via-white/10 to-transparent mt-2" />
                )}
            </div>
            {/* Content Box */}
            <div className="flex-1 min-w-0 pb-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.035] hover:border-white/[0.1] transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <h3 className="text-[13.5px] font-semibold text-white leading-snug">{exp.title}</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {exp.is_current && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium">
                                    <span className="w-1 h-1 rounded-full bg-green-400 mr-1 animate-pulse" />
                                    Present
                                </span>
                            )}
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 text-[10px]">
                                {exp.type}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 text-[10px]">
                                {exp.work_mode}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2">
                        <span className="text-[12px] text-white/50">{exp.company}</span>
                        <span className="text-white/20 text-[10px]">•</span>
                        <div className="flex items-center gap-1 text-[12px] text-white/40">
                            <MapPin className="w-3 h-3" />
                            <span>{exp.location}</span>
                            {exp.location.includes('Indonesia') && (
                                <span className="inline-flex items-center justify-center w-4 h-3 rounded-[2px] bg-blue-600/80 text-white text-[8px] font-bold">ID</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-2.5 text-[11.5px] text-white/30">
                        <span>{exp.start_date} - {exp.end_date || 'Sekarang'}</span>
                        <span>•</span>
                        <span>{exp.duration}</span>
                    </div>

                    {/* Toggle detail */}
                    {exp.description && (
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-1 text-[11.5px] text-white/30 hover:text-white/50 transition-colors"
                        >
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
                            <span>{open ? 'Sembunyikan detail' : 'Tampilkan detail'}</span>
                        </button>
                    )}

                    {open && exp.description && (
                        <div className="mt-3 pt-3 border-t border-white/[0.06]">
                            <p className="text-[12.5px] text-white/45 leading-relaxed">{exp.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EducationCard({ edu, isLast }) {
    return (
        <div className="relative flex gap-4 mb-4">
            {/* Logo dengan Timeline */}
            <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center overflow-hidden">
                        {edu.logo ? (
                            <img 
                                src={edu.logo} 
                                alt={edu.institution} 
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <GraduationCap className="w-4 h-4 text-white/30" />
                        )}
                    </div>
                </div>
                
                {!isLast && (
                    <div className="w-px h-full bg-gradient-to-b from-white/20 via-white/10 to-transparent mt-2" />
                )}
            </div>

            {/* Content Box */}
            <div className="flex-1 min-w-0 pb-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.035] hover:border-white/[0.1] transition-all duration-300">
                    <h3 className="text-[13.5px] font-semibold text-white leading-snug mb-1">{edu.institution}</h3>
                    
                    <div className="flex flex-wrap items-center gap-x-1.5 mb-1.5">
                        <span className="text-[12px] text-white/50">{edu.degree}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[12px] text-white/50">{edu.field}</span>
                        {edu.gpa && (
                            <>
                                <span className="text-white/20">•</span>
                                <span className="text-[12px] text-white/50">GPA: <span className="text-white/70 font-medium">{edu.gpa}</span></span>
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[11.5px] text-white/30">
                        <span className="font-medium">{edu.start_year} - {edu.end_year}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{edu.location}</span>
                        {edu.location.includes('Indonesia') && (
                            <span className="inline-flex items-center justify-center w-4 h-3 rounded-[2px] bg-blue-600/80 text-white text-[8px] font-bold">ID</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function About({ profile, experiences, educations }) {
    const [loading, setLoading] = useState(true);

    const displayExperiences = experiences;
    const displayEducations = educations;
    const displayProfile = profile || { name: 'Izza Wildan Ridhoni' };

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    if (loading) {
        return <MainLayout><AboutPageSkeleton /></MainLayout>;
    }

    return (
        <MainLayout>
            <div className="space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Tentang</h1>
                    <p className="text-[13px] text-white/40">Pengenalan singkat mengenai siapa saya.</p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Bio */}
                <div className="space-y-4 text-[13.5px] text-white/60 leading-[1.75]">
                   <p>Saya Izza Wildan, seorang Web Developer yang berasal dari Temanggung, Jawa Tengah, dengan minat besar dalam membangun solusi digital yang bermanfaat dan berdampak.
                    Saya fokus pada pengembangan aplikasi yang terstruktur dengan baik, mudah digunakan, dan dapat berkembang sesuai kebutuhan. Bagi saya, kualitas dan kejelasan dalam sebuah sistem adalah hal yang penting.</p>
                    <p>Saya juga terbiasa bekerja secara kolaboratif, memiliki komunikasi yang baik, serta mampu mengatur waktu dengan efektif untuk menyelesaikan setiap proyek secara optimal.</p>

                    <div className="pt-1">
                        <p className="text-white/50 mb-2">Salam hangat,</p>
                        <p className="text-[32px] text-amber-400"
                                style={{ 
                                    fontFamily: "'Caveat', cursive",
                                    fontWeight: 700 // Bold
                                }}
                            > Wildan
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Career */}
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-[18px] font-bold text-white tracking-tight">Pengalaman</h2>
                    </div>
                    <p className="text-[13px] text-white/40 mb-6">Perjalanan profesional saya.</p>

                    <div className="space-y-0">
                        {displayExperiences.map((exp, index) => (
                            <ExperienceCard 
                                key={exp.id} 
                                exp={exp} 
                                isLast={index === displayExperiences.length - 1} 
                            />
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Education */}
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-[18px] font-bold text-white tracking-tight">Pendidikan</h2>
                    </div>
                    <p className="text-[13px] text-white/40 mb-6">Perjalanan pendidikan saya.</p>

                    <div className="space-y-0">
                        {displayEducations.map((edu, index) => (
                            <EducationCard 
                                key={edu.id} 
                                edu={edu} 
                                isLast={index === displayEducations.length - 1} 
                            />
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}