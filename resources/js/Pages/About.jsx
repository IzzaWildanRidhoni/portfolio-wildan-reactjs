import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { AboutPageSkeleton } from '@/Components/Skeleton';
import { Briefcase, GraduationCap, ChevronRight, MapPin } from 'lucide-react';

const staticExperiences = [
    {
        id: 1,
        title: 'Backend Golang Developer',
        company: 'Pt. Affan Technology Indonesia (Parto.id)',
        logo: null,
        location: 'Jambi, Indonesia',
        start_date: 'Jul 2025',
        end_date: 'Sep 2025',
        duration: '2 bulan',
        type: 'Internship',
        work_mode: 'Hybrid',
        description: 'Mengembangkan REST API menggunakan Golang untuk sistem internal perusahaan, termasuk modul manajemen pengguna, notifikasi, dan integrasi layanan pihak ketiga.',
    },
    {
        id: 2,
        title: 'Head of Technology in the Research and Technology Division',
        company: 'Himpunan Mahasiswa Sistem Informasi Universitas Jambi (HIMASI UNJA)',
        logo: null,
        location: 'Jambi, Indonesia',
        start_date: 'Dec 2024',
        end_date: 'Dec 2025',
        duration: '1 tahun',
        type: 'Part-time',
        work_mode: 'Onsite',
        description: 'Memimpin divisi riset dan teknologi, mengkoordinasi proyek pengembangan software untuk keperluan organisasi mahasiswa.',
    },
    {
        id: 3,
        title: 'Mobile Development Cohort',
        company: 'Bangkit Academy led by Google, Tokopedia, Gojek & Traveloka',
        logo: null,
        location: 'Remote',
        start_date: 'Sep 2024',
        end_date: 'Dec 2024',
        duration: '3 bulan',
        type: 'Part-time',
        work_mode: 'Remote',
        description: 'Program intensif pengembangan aplikasi mobile Android menggunakan Kotlin, mencakup arsitektur MVVM, Jetpack Compose, dan integrasi dengan API backend.',
    },
    {
        id: 4,
        title: 'Mobile Developer',
        company: 'Pt. Amanah Karya Indonesia (Amanah Corp)',
        logo: null,
        location: 'Depok, Indonesia',
        start_date: 'Oct 2024',
        end_date: 'Dec 2024',
        duration: '2 bulan',
        type: 'Part-time',
        work_mode: 'Remote',
        description: 'Membangun aplikasi mobile Android untuk klien perusahaan dengan teknologi Kotlin dan Jetpack.',
    },
];

const staticEducations = [
    {
        id: 1,
        institution: 'Universitas Jambi',
        logo: null,
        degree: "Bachelor's degree",
        field: 'Information Systems, (S.Kom)',
        gpa: '3.80/4.00',
        start_year: '2022',
        end_year: '2026',
        location: 'Jambi, Indonesia',
    },
    {
        id: 2,
        institution: 'SMAN 1 Tanjung Jabung Barat',
        logo: null,
        degree: 'Senior High School',
        field: 'Science',
        gpa: null,
        start_year: '2019',
        end_year: '2022',
        location: 'Tanjung Jabung Barat, Jambi, Indonesia',
    },
];

function ExperienceCard({ exp }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.035] transition-colors">
            <div className="flex gap-3.5">
                {/* Logo */}
                <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {exp.logo ? (
                        <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain p-1" />
                    ) : (
                        <Briefcase className="w-4 h-4 text-white/30" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-[13.5px] font-semibold text-white leading-snug">{exp.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
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
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1.5 text-[11.5px] text-white/30">
                        <span>{exp.start_date} - {exp.end_date || 'Sekarang'}</span>
                        <span>•</span>
                        <span>{exp.duration}</span>
                        <span>•</span>
                        <span>{exp.type}</span>
                        <span>•</span>
                        <span>{exp.work_mode}</span>
                    </div>

                    {/* Toggle detail */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-1 mt-2 text-[11.5px] text-white/30 hover:text-white/50 transition-colors"
                    >
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
                        <span>{open ? 'Sembunyikan detail' : 'Tampilkan detail'}</span>
                    </button>

                    {open && exp.description && (
                        <p className="mt-2.5 text-[12.5px] text-white/45 leading-relaxed">{exp.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function EducationCard({ edu }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.035] transition-colors">
            <div className="flex gap-3.5">
                {/* Logo */}
                <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {edu.logo ? (
                        <img src={edu.logo} alt={edu.institution} className="w-full h-full object-contain p-1" />
                    ) : (
                        <GraduationCap className="w-4 h-4 text-white/30" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-[13.5px] font-semibold text-white">{edu.institution}</h3>
                    <div className="flex flex-wrap items-center gap-x-1.5 mt-0.5">
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
                    <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-white/30">
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

    const displayExperiences = experiences?.length ? experiences : staticExperiences;
    const displayEducations = educations?.length ? educations : staticEducations;
    const displayProfile = profile || { name: 'Satria Bahari' };

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
                    <p>Saya {displayProfile.name}, seorang Software Engineer yang berbasis di Jambi, berdedikasi untuk membangun solusi digital yang berdampak. Saya spesialis dalam pengembangan platform web yang skalabel dan aplikasi mobile menggunakan tech stack modern, termasuk Next.js, TypeScript, dan pengembangan Android native dengan Kotlin.</p>
                    <p>Fokus utama saya adalah merancang arsitektur perangkat lunak yang tidak hanya berfungsi tetapi juga terstruktur dengan baik, mudah dipelihara, dan skalabel untuk memenuhi kebutuhan bisnis. Saya percaya bahwa kode berkualitas tinggi harus berjalan beriringan dengan efisiensi sistem dan kejelasan logis.</p>
                    <p>Saya memadukan keahlian teknis dengan komunikasi proaktif, berpikir kritis, dan manajemen waktu yang efektif. Saya berkembang dalam lingkungan kolaboratif dan memanfaatkan keterampilan kepemimpinan untuk memastikan setiap proyek memberikan hasil optimal dan dampak nyata.</p>

                    <div className="pt-1">
                        <p className="text-white/50 mb-2">Salam hangat,</p>
                        <p
                            className="text-[26px] text-white/80"
                            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontWeight: 600 }}
                        >
                            satria
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Career */}
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <Briefcase className="w-4 h-4 text-white/50" />
                        <h2 className="text-[18px] font-bold text-white tracking-tight">Karier</h2>
                    </div>
                    <p className="text-[13px] text-white/40 mb-4">Perjalanan profesional saya.</p>

                    <div className="space-y-3">
                        {displayExperiences.map(exp => (
                            <ExperienceCard key={exp.id} exp={exp} />
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Education */}
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <GraduationCap className="w-4 h-4 text-white/50" />
                        <h2 className="text-[18px] font-bold text-white tracking-tight">Pendidikan</h2>
                    </div>
                    <p className="text-[13px] text-white/40 mb-4">Perjalanan pendidikan saya.</p>

                    <div className="space-y-3">
                        {displayEducations.map(edu => (
                            <EducationCard key={edu.id} edu={edu} />
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}