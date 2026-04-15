// resources/js/Pages/Blog/Index.jsx

import { useState, useMemo, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Search, X, Tag, Calendar, Eye, BookOpen, Rss, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Skeleton } from '@/Components/Skeleton';

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function BlogIndexSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
            </div>
            {/* Featured skeleton */}
            <div className="flex rounded-xl overflow-hidden border border-white/[0.05] h-[200px]">
                <Skeleton className="w-[320px] h-full rounded-none flex-shrink-0" />
                <div className="flex-1 p-5 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-white/[0.05]">
                        <Skeleton className="h-[160px] w-full rounded-none" />
                        <div className="p-4 space-y-2.5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                            <div className="flex gap-1.5 pt-0.5">
                                <Skeleton className="h-5 w-14 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <div className="flex justify-between pt-1.5 border-t border-white/[0.04]">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-3.5 w-12" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const POSTS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 280;

function useDebounce(value, delay) {
    const [deb, setDeb] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDeb(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return deb;
}

const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const estimateRead = (html) => {
    if (!html) return 1;
    const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
};

const stripHtml = (html, max = 110) => {
    if (!html) return '';
    const t = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return t.length <= max ? t : t.slice(0, max) + '...';
};

const defaultThumb = (title) =>
    `https://placehold.co/600x340/0f172a/475569?text=${encodeURIComponent(title ?? 'Blog')}&font=roboto&font_size=16`;

// ── Sub Components ────────────────────────────────────────────────────────────
function SearchInput({ value, onChange }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
                type="text" value={value} onChange={e => onChange(e.target.value)}
                placeholder="Cari artikel, tags, kategori..."
                className="w-full h-9 pl-9 pr-8 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[12.5px] text-white/70 placeholder-white/25 focus:outline-none focus:border-[#3F3F3F] focus:ring-1 focus:ring-[#3F3F3F]/30 transition-all"
            />
            {value && (
                <button onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}

function CategoryPill({ cat, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium border transition-all whitespace-nowrap ${
                active
                    ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-200'
                    : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/65'
            }`}
            // ✅ Hapus inline style, semua diatur via className
        >
            {cat.name}
        </button>
    );
}

function FeaturedCard({ blog }) {
    const [err, setErr] = useState(false);
    const src = blog.thumbnail && !err ? blog.thumbnail : defaultThumb(blog.title);
    const excerpt = stripHtml(blog.excerpt || blog.content, 175);

    return (
        <Link href={`/blog/${blog.slug}`}
            className="group relative flex flex-col sm:flex-row rounded-xl border border-white/[0.07] overflow-hidden bg-white/[0.02] hover:border-indigo-500/25 hover:bg-white/[0.035] transition-all duration-200 sm:h-[210px]">
            <div className="relative sm:w-[320px] h-[170px] sm:h-full flex-shrink-0 overflow-hidden bg-white/[0.03]">
                <img src={src} alt={blog.title} loading="lazy" onError={() => setErr(true)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/25 pointer-events-none" />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500 text-white shadow-lg">
                    ✦ Terbaru
                </span>
            </div>
            <div className="flex flex-col justify-center p-5 gap-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    {blog.category && (
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: blog.category.color + '22', color: blog.category.color }}>
                            {blog.category.name}
                        </span>
                    )}
                    <span className="text-[11px] text-white/30 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{formatDate(blog.published_at)}
                    </span>
                    <span className="text-[11px] text-white/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{estimateRead(blog.content)} mnt baca
                    </span>
                </div>
                <h2 className="text-[16px] sm:text-[18px] font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                    {blog.title}
                </h2>
                <p className="text-[12.5px] text-white/45 line-clamp-2 leading-relaxed">{excerpt}</p>
                {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 4).map(t => (
                            <span key={t} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/35 border border-white/[0.07]">
                                <Tag className="w-2 h-2" />#{t}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

function BlogCard({ blog }) {
    const [err, setErr] = useState(false);
    const src = blog.thumbnail && !err ? blog.thumbnail : defaultThumb(blog.title);
    const excerpt = stripHtml(blog.excerpt || blog.content, 100);

    return (
        <Link href={`/blog/${blog.slug}`}
            className="group flex flex-col rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.04] transition-all duration-200">
            {/* Thumbnail */}
            <div className="relative h-[160px] overflow-hidden bg-white/[0.03] flex-shrink-0">
                <img src={src} alt={blog.title} loading="lazy" onError={() => setErr(true)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                {blog.category && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: blog.category.color + 'cc', color: '#fff' }}>
                        {blog.category.name}
                    </span>
                )}
            </div>
            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="text-[13px] font-semibold text-white/88 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-[12px] text-white/38 leading-relaxed line-clamp-2 flex-1 min-h-[2.4rem]">
                    {excerpt || <span className="italic opacity-60">Tidak ada ringkasan</span>}
                </p>
                {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {blog.tags.slice(0, 3).map(t => (
                            <span key={t} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/38 border border-white/[0.06]">
                                <Tag className="w-2 h-2" />#{t}
                            </span>
                        ))}
                        {blog.tags.length > 3 && (
                            <span className="text-[10px] text-white/25">+{blog.tags.length - 3}</span>
                        )}
                    </div>
                )}
                {/* Meta footer */}
                <div className="flex items-center gap-3 text-[10.5px] text-white/28 mt-auto pt-2.5 border-t border-white/[0.05]">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.published_at)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{estimateRead(blog.content)} mnt</span>
                    <span className="flex items-center gap-1 ml-auto"><Eye className="w-3 h-3" />{blog.views ?? 0}</span>
                </div>
            </div>
        </Link>
    );
}

function Pagination({ current, total, onChange }) {
    if (total <= 1) return null;

    const pages = useMemo(() => {
        const arr = [];
        if (total <= 5) {
            for (let i = 1; i <= total; i++) arr.push(i);
        } else if (current <= 3) {
            [1, 2, 3, 4, '...', total].forEach(p => arr.push(p));
        } else if (current >= total - 2) {
            [1, '...', total - 3, total - 2, total - 1, total].forEach(p => arr.push(p));
        } else {
            [1, '...', current - 1, current, current + 1, '...', total].forEach(p => arr.push(p));
        }
        return arr;
    }, [current, total]);

    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            <button onClick={() => onChange(current - 1)} disabled={current === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/38 hover:text-white/68 hover:bg-white/[0.05] disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
            </button>
            {pages.map((p, i) =>
                p === '...'
                    ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-[11px] text-white/20">…</span>
                    : <button key={p} onClick={() => onChange(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11.5px] transition-colors ${
                            current === p
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/35'
                                : 'text-white/38 hover:text-white/68 hover:bg-white/[0.05]'
                        }`}>{p}</button>
            )}
            <button onClick={() => onChange(current + 1)} disabled={current === total}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/38 hover:text-white/68 hover:bg-white/[0.05] disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BlogIndex({ blogs = [], categories = [] }) {
    const [isLoading, setIsLoading]     = useState(true);
    const [search, setSearch]           = useState('');
    const [activeCat, setActiveCat]     = useState('');
    const [activeTag, setActiveTag]     = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, activeCat, activeTag]);

    const allTags = useMemo(() => {
        const s = new Set();
        blogs.forEach(b => (b.tags ?? []).forEach(t => s.add(t)));
        return [...s].sort();
    }, [blogs]);

    const filtered = useMemo(() => {
        let r = [...blogs];
        if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            r = r.filter(b =>
                b.title?.toLowerCase().includes(q) ||
                b.excerpt?.toLowerCase().includes(q) ||
                b.tags?.some(t => t.toLowerCase().includes(q)) ||
                b.category?.name?.toLowerCase().includes(q)
            );
        }
        if (activeCat) r = r.filter(b => String(b.blog_category_id) === String(activeCat));
        if (activeTag) r = r.filter(b => b.tags?.includes(activeTag));
        return r;
    }, [blogs, debouncedSearch, activeCat, activeTag]);

    const hasFilters = debouncedSearch || activeCat || activeTag;
    const featured   = !hasFilters ? (filtered[0] ?? null) : null;
    const gridBlogs  = !hasFilters ? filtered.slice(1) : filtered;
    const totalPages = Math.ceil(gridBlogs.length / POSTS_PER_PAGE);
    const paginated  = gridBlogs.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

    if (isLoading) {
        return <MainLayout><BlogIndexSkeleton /></MainLayout>;
    }

    return (
        <MainLayout>
            <div className="space-y-5">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-[22px] font-bold text-white tracking-tight">Blog</h1>
                    </div>
                     <p className="text-[13px] text-white/40">Tulisan dan catatan seputar teknologi, web development, dan hal lainnya.</p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Search */}
                <SearchInput value={search} onChange={setSearch} />

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setActiveCat('')}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium border transition-all ${
                                !activeCat
                                    ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-200'
                                    : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/65'
                            }`}>
                            <BookOpen className="w-3 h-3" /> Semua
                        </button>
                        {categories.map(cat => (
                            <CategoryPill key={cat.id} cat={cat}
                                active={String(activeCat) === String(cat.id)}
                                onClick={() => setActiveCat(p => String(p) === String(cat.id) ? '' : cat.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Tag cloud */}
                {/* {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {allTags.map(tag => (
                            <button key={tag} onClick={() => setActiveTag(p => p === tag ? '' : tag)}
                                className={`inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full border transition-all ${
                                    activeTag === tag
                                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                                        : 'bg-white/[0.03] border-white/[0.06] text-white/32 hover:border-white/18 hover:text-white/58'
                                }`}>
                                <Tag className="w-2.5 h-2.5" />#{tag}
                            </button>
                        ))}
                        {activeTag && (
                            <button onClick={() => setActiveTag('')}
                                className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full bg-red-500/8 border border-red-500/28 text-red-400/80 hover:bg-red-500/15 transition-all">
                                <X className="w-2.5 h-2.5" /> reset
                            </button>
                        )}
                    </div>
                )} */}

                {/* Stats */}
                <div className="flex items-center gap-4 text-[11.5px]">
                    <span className="text-white/32">
                        <span className="text-white/65 font-medium">{filtered.length}</span> artikel
                        {hasFilters && ' ditemukan'}
                    </span>
                    {hasFilters && (
                     <button onClick={() => { setSearch(''); setActiveCat(''); setActiveTag(''); }}
                        className="flex items-center gap-1 text-yellow-400/80 hover:text-yellow-300 transition-colors">
                        <X className="w-3 h-3" /> Reset filter
                    </button>
                    )}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-12 text-center">
                        <BookOpen className="w-9 h-9 text-white/18 mx-auto mb-3" />
                        <p className="text-[13px] text-white/40">
                            {hasFilters ? 'Tidak ada artikel yang cocok.' : 'Belum ada artikel.'}
                        </p>
                    </div>
                )}

                {/* Featured */}
                {featured && <FeaturedCard blog={featured} />}

                {/* Grid */}
                {paginated.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginated.map(blog => <BlogCard key={blog.id} blog={blog} />)}
                    </div>
                )}

                {/* Pagination */}
                {!hasFilters && totalPages > 1 && (
                    <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
                )}
            </div>
        </MainLayout>
    );
}