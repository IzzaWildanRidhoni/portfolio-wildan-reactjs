import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { AchievementsPageSkeleton } from '@/Components/Skeleton';
import { Search, ExternalLink, X, Calendar, Badge, Building2, Link2, Tag, Folder } from 'lucide-react';

// ─── Color Maps ──────────────────────────────────────────────────────────────

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

// ─── Custom Dropdown Component ───────────────────────────────────────────────

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

function AchievementCard({ ach, onClick }) {
    return (
        <div 
            onClick={() => onClick(ach)}
            className="group rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
        >
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

// ─── Achievement Modal ────────────────────────────────────────────────────────

function AchievementModal({ achievement, onClose }) {
    const modalRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    if (!achievement) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
            
            {/* Modal Content */}
            <div 
                ref={modalRef}
                className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 animate-scale-in"
                style={{ backgroundColor: achievement.bg || '#1a1a1a' }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors group"
                >
                    <X className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </button>

                {/* Header Image Area */}
                <div 
                    className="h-48 relative flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: achievement.bg || '#111' }}
                >
                    {achievement.thumbnail ? (
                        <img
                            src={achievement.thumbnail}
                            alt={achievement.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-32 h-32 rounded-full opacity-15"
                                style={{ 
                                    backgroundColor: achievement.accent, 
                                    boxShadow: `0 0 60px ${achievement.accent}40` 
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                <div
                                    className="text-xs font-mono font-bold tracking-widest uppercase opacity-50"
                                    style={{ color: achievement.accent }}
                                >
                                    {achievement.issuer}
                                </div>
                                {achievement.credential_id && (
                                    <div className="text-[10px] text-white/30 font-mono tracking-wider">
                                        {achievement.credential_id}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                </div>

                {/* Modal Body */}
                <div className="p-6 -mt-8 relative">
                    {/* Type & Category Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 ${typeColors[achievement.type] || 'bg-white/10 text-white/50'}`}>
                            <Badge className="w-3 h-3" />
                            {achievement.type}
                        </span>
                        <span className={`text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 ${categoryColors[achievement.category] || 'bg-white/10 text-white/50'}`}>
                            <Folder className="w-3 h-3" />
                            {achievement.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                        {achievement.title}
                    </h2>

                    {/* Issuer */}
                    <div className="flex items-center gap-2 text-white/60 mb-5">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{achievement.issuer}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-[11px] uppercase tracking-wider font-mono">Issued Date</span>
                            </div>
                            <p className="text-sm text-white/80 font-medium">{achievement.issued_date}</p>
                        </div>
                        
                        {achievement.credential_id && (
                            <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                                <div className="flex items-center gap-2 text-white/40 mb-1">
                                    <Tag className="w-3.5 h-3.5" />
                                    <span className="text-[11px] uppercase tracking-wider font-mono">Credential ID</span>
                                </div>
                                <p className="text-sm text-white/80 font-mono break-all">{achievement.credential_id}</p>
                            </div>
                        )}
                    </div>

                    {/* Credential URL */}
                    {achievement.credential_url && (
                        <a
                            href={achievement.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15] text-white/80 hover:text-white transition-all group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            <span className="text-sm font-medium">Verifikasi Credential</span>
                        </a>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/[0.06] bg-black/10">
                    <p className="text-[11px] text-white/30 text-center font-mono">
                        Klik di luar area atau tekan <kbd className="px-1.5 py-0.5 bg-white/[0.08] rounded text-white/50">ESC</kbd> untuk menutup
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Page Options ─────────────────────────────────────────────────────────────

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

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function Achievements({ achievements, filters }) {
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState(filters?.search || '');
    const [type, setType]         = useState(filters?.type || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    const displayAchievements = achievements;

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

    // Client-side filter
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

                    {/* Type filter */}
                    <CustomSelect
                        value={type}
                        onChange={(v) => handleFilterChange('type', v)}
                        placeholder="Filter by Type"
                        options={TYPE_OPTIONS}
                    />

                    {/* Category filter */}
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
                            <AchievementCard 
                                key={ach.id} 
                                ach={ach} 
                                onClick={setSelectedAchievement} 
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Achievement Detail Modal */}
            {selectedAchievement && (
                <AchievementModal 
                    achievement={selectedAchievement} 
                    onClose={() => setSelectedAchievement(null)} 
                />
            )}
        </MainLayout>
    );
}