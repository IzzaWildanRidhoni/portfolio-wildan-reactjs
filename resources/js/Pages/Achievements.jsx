import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { AchievementsPageSkeleton } from '@/Components/Skeleton';
import { Search, ExternalLink } from 'lucide-react';

// const staticAchievements = [
//     {
//         id: 1,
//         title: 'Backend Developer Internship - Parto.id',
//         issuer: 'Affan Technology Indonesia',
//         credential_id: '196/EKS/HCLGA/ATI/VIII/2025',
//         thumbnail: null,
//         issued_date: 'JULY 2025',
//         type: 'Profesional',
//         category: 'Backend',
//         credential_url: null,
//         bg: '#0f2b1a',
//         accent: '#22c55e',
//     },
//     {
//         id: 2,
//         title: 'E-book Petunjuk Pro: Freelance Web Developer & Kerja Remote',
//         issuer: 'Build With Angga',
//         credential_id: null,
//         thumbnail: null,
//         issued_date: 'SEPTEMBER 2025',
//         type: 'Course',
//         category: 'Freelance',
//         credential_url: null,
//         bg: '#1a1a2e',
//         accent: '#6366f1',
//     },
//     {
//         id: 3,
//         title: 'Belajar Membuat Aplikasi Android dengan Jetpack Compose',
//         issuer: 'Dicoding Indonesia',
//         credential_id: '81P2LGL38ZOY',
//         thumbnail: null,
//         issued_date: 'JANUARY 2025',
//         type: 'Course',
//         category: 'Mobile',
//         credential_url: null,
//         bg: '#1a1220',
//         accent: '#a855f7',
//     },
//     {
//         id: 4,
//         title: 'Bangkit Academy 2024 by Google',
//         issuer: 'Bangkit Academy',
//         credential_id: 'BANGKIT-2024-001',
//         thumbnail: null,
//         issued_date: 'DECEMBER 2024',
//         type: 'Certificate',
//         category: 'Mobile',
//         credential_url: null,
//         bg: '#1a1500',
//         accent: '#eab308',
//     },
//     {
//         id: 5,
//         title: 'Google UX Design Certificate',
//         issuer: 'Google / Coursera',
//         credential_id: 'GOOGLE-UX-2024',
//         thumbnail: null,
//         issued_date: 'NOVEMBER 2024',
//         type: 'Certificate',
//         category: 'Design',
//         credential_url: null,
//         bg: '#1a0a0a',
//         accent: '#ef4444',
//     },
//     {
//         id: 6,
//         title: 'Belajar Pengembangan Web Frontend Expert',
//         issuer: 'Dicoding Indonesia',
//         credential_id: 'DICODING-FE-EXP',
//         thumbnail: null,
//         issued_date: 'OCTOBER 2024',
//         type: 'Course',
//         category: 'Frontend',
//         credential_url: null,
//         bg: '#001a1a',
//         accent: '#06b6d4',
//     },
//     {
//         id: 7,
//         title: 'React - The Complete Guide 2024',
//         issuer: 'Udemy / Maximilian Schwarzmüller',
//         credential_id: 'UDEMY-REACT-2024',
//         thumbnail: null,
//         issued_date: 'AUGUST 2024',
//         type: 'Course',
//         category: 'Frontend',
//         credential_url: null,
//         bg: '#0a1a00',
//         accent: '#84cc16',
//     },
//     {
//         id: 8,
//         title: 'AWS Cloud Practitioner Essentials',
//         issuer: 'Amazon Web Services',
//         credential_id: 'AWS-CPE-2024',
//         thumbnail: null,
//         issued_date: 'JULY 2024',
//         type: 'Certificate',
//         category: 'DevOps',
//         credential_url: null,
//         bg: '#1a0f00',
//         accent: '#f97316',
//     },
//     {
//         id: 9,
//         title: 'Belajar Dasar Git dengan GitHub',
//         issuer: 'Dicoding Indonesia',
//         credential_id: 'DICODING-GIT',
//         thumbnail: null,
//         issued_date: 'JUNE 2024',
//         type: 'Course',
//         category: 'Backend',
//         credential_url: null,
//         bg: '#0a0a0a',
//         accent: '#ffffff',
//     },
// ];

const typeColors = {
    'Profesional': 'bg-emerald-500/15 text-emerald-400',
    'Course':      'bg-blue-500/15 text-blue-400',
    'Certificate': 'bg-purple-500/15 text-purple-400',
    'Badge':       'bg-yellow-500/15 text-yellow-400',
};

const categoryColors = {
    'Backend':   'bg-green-500/10 text-green-400',
    'Frontend':  'bg-blue-500/10 text-blue-400',
    'Mobile':    'bg-purple-500/10 text-purple-400',
    'DevOps':    'bg-orange-500/10 text-orange-400',
    'Design':    'bg-pink-500/10 text-pink-400',
    'Freelance': 'bg-yellow-500/10 text-yellow-400',
};

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

function CustomSelect({ value, onChange, placeholder, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find((o) => o.value === value);

    return (
        <div ref={ref} className="relative">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-[13px] text-white/60 hover:bg-white/[0.07] hover:border-white/[0.14] transition-colors cursor-pointer whitespace-nowrap select-none"
            >
                <span className={selected ? 'text-white/90' : ''}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg
                    className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {open && (
                <div className="absolute top-[calc(100%+4px)] left-0 min-w-[170px] bg-[#161616] border border-white/[0.1] rounded-lg overflow-hidden z-50 shadow-xl shadow-black/40">
                    {/* Reset option */}
                    <div
                        className={`flex items-center justify-between px-3 py-2 text-[13px] cursor-pointer transition-colors ${
                            !value
                                ? 'text-white/90 bg-white/[0.05]'
                                : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80'
                        }`}
                        onClick={() => { onChange(''); setOpen(false); }}
                    >
                        <span>{placeholder}</span>
                        {!value && (
                            <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/[0.06]" />

                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`flex items-center justify-between px-3 py-2 text-[13px] cursor-pointer transition-colors ${
                                value === opt.value
                                    ? 'text-white/90 bg-white/[0.05]'
                                    : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80'
                            }`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                        >
                            <span>{opt.label}</span>
                            {value === opt.value && (
                                <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Achievement Card ─────────────────────────────────────────────────────────

function AchievementCard({ ach }) {
    return (
        <div className="group rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer">

            {/* Thumbnail area */}
            <div
                className="h-[155px] relative flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: ach.bg || '#111' }}
            >
                {ach.thumbnail ? (
                    <img
                        src={ach.thumbnail}
                        alt={ach.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-20 h-20 rounded-full opacity-20"
                            style={{ backgroundColor: ach.accent, boxShadow: `0 0 40px ${ach.accent}` }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <div
                                className="text-[11px] font-mono font-bold tracking-widest uppercase opacity-60"
                                style={{ color: ach.accent }}
                            >
                                {ach.issuer.split(' ').slice(0, 2).join(' ')}
                            </div>
                            <div className="text-[9px] text-white/30 font-mono tracking-wider">
                                {ach.credential_id || 'CERTIFICATE'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* External link on hover */}
                {ach.credential_url && (
                    <a
                        href={ach.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </a>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {ach.credential_id && (
                    <p className="text-[10px] font-mono text-white/25 mb-1 tracking-wide">{ach.credential_id}</p>
                )}
                <h3 className="text-[13px] font-semibold text-white leading-snug mb-1.5 line-clamp-2">
                    {ach.title}
                </h3>
                <p className="text-[11.5px] text-white/40 mb-2.5">{ach.issuer}</p>

                <div className="flex flex-wrap gap-1.5 mb-2.5">
                    <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium ${typeColors[ach.type] || 'bg-white/10 text-white/50'}`}>
                        {ach.type}
                    </span>
                    <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium ${categoryColors[ach.category] || 'bg-white/10 text-white/50'}`}>
                        {ach.category}
                    </span>
                </div>

                <p className="text-[10.5px] text-white/25 uppercase tracking-widest font-mono">
                    Issued on {ach.issued_date}
                </p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
    { value: 'Certificate', label: 'Certificate' },
    { value: 'Course',      label: 'Course' },
    { value: 'Profesional', label: 'Profesional' },
    { value: 'Badge',       label: 'Badge' },
];

const CATEGORY_OPTIONS = [
    { value: 'Backend',   label: 'Backend' },
    { value: 'Frontend',  label: 'Frontend' },
    { value: 'Mobile',    label: 'Mobile' },
    { value: 'DevOps',    label: 'DevOps' },
    { value: 'Design',    label: 'Design' },
    { value: 'Freelance', label: 'Freelance' },
];

export default function Achievements({ achievements, filters }) {
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState(filters?.search || '');
    const [type, setType]         = useState(filters?.type || '');
    const [category, setCategory] = useState(filters?.category || '');

    // const displayAchievements = achievements?.length ? achievements : staticAchievements;
    const displayAchievements = achievements ;
    // const displayAchievements =  staticAchievements;

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (achievements) {
            router.get('/pencapaian', { search, type, category }, { preserveState: true, replace: true });
        }
    };

    const handleFilterChange = (field, value) => {
        const nextType     = field === 'type'     ? value : type;
        const nextCategory = field === 'category' ? value : category;

        if (field === 'type')     setType(value);
        if (field === 'category') setCategory(value);

        if (achievements) {
            router.get(
                '/pencapaian',
                { search, type: nextType, category: nextCategory },
                { preserveState: true, replace: true }
            );
        }
    };

    // Client-side filter for static data
    const filtered = !search && !type && !category
        ? displayAchievements
        : displayAchievements.filter((a) => {
            const matchSearch = !search
                || a.title.toLowerCase().includes(search.toLowerCase())
                || a.issuer.toLowerCase().includes(search.toLowerCase());
            const matchType = !type     || a.type     === type;
            const matchCat  = !category || a.category === category;
            return matchSearch && matchType && matchCat;
    });

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Pencapaian</h1>
                    <p className="text-[13px] text-white/40">
                        Koleksi sertifikat dan lencana yang telah saya raih sepanjang perjalanan profesional dan akademik saya.
                    </p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Filter bar */}
                <form onSubmit={handleSearch} className="flex flex-wrap gap-2.5">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>

                    {/* Type filter — custom dropdown */}
                    <CustomSelect
                        value={type}
                        onChange={(v) => handleFilterChange('type', v)}
                        placeholder="Filter by Type"
                        options={TYPE_OPTIONS}
                    />

                    {/* Category filter — custom dropdown */}
                    <CustomSelect
                        value={category}
                        onChange={(v) => handleFilterChange('category', v)}
                        placeholder="Filter by Category"
                        options={CATEGORY_OPTIONS}
                    />
                </form>

                {/* Total count */}
                <p className="text-[13px] text-white/40">
                    Total: <span className="text-white/60 font-medium">{filtered.length}</span>
                </p>

                {/* Grid */}
                {loading ? (
                    <AchievementsPageSkeleton />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-white/25">
                        <p className="text-[14px]">Tidak ada pencapaian ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filtered.map((ach) => (
                            <AchievementCard key={ach.id} ach={ach} />
                        ))}
                    </div>
                )}

            </div>
        </MainLayout>
    );
}