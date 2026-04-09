// resources/js/Pages/Admin/Achievements/Index.jsx

import { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, StatusBadge, ConfirmModal, Pagination } from '@/Components/Admin/UI';
import {
    Plus, Search, Trash2, Pencil, ChevronDown, ChevronUp,
    ChevronsUpDown, ImageOff, X, RefreshCw, MoreVertical,
    CheckSquare, Square, CheckCircle2, AlertCircle,
} from 'lucide-react';

// ─── Per Page Select ──────────────────────────────────────────────────────────

function PerPageSelect({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 pr-7 text-[12px] text-white/60 focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
        >
            {[10, 25, 50, 100].map(n => (
                <option key={n} value={n} className="bg-[#161616]">{n} per page</option>
            ))}
        </select>
    );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ field, current, direction }) {
    if (field !== current) return <ChevronsUpDown className="w-3 h-3 opacity-30" />;
    return direction === 'asc'
        ? <ChevronUp className="w-3 h-3 text-indigo-400" />
        : <ChevronDown className="w-3 h-3 text-indigo-400" />;
}

// ─── Flash Toast ──────────────────────────────────────────────────────────────

function Flash() {
    const { flash } = usePage().props;
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState(null);
    const [isSuccess, setIsSuccess] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setMsg(flash.success || flash.error);
            setIsSuccess(!!flash.success);
            setShow(true);
            const t = setTimeout(() => setShow(false), 4000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    if (!show || !msg) return null;

    return (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl shadow-black/40 text-[13px] font-medium max-w-[360px] animate-in slide-in-from-top-3 duration-300 ${
            isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'
        }`}>
            {isSuccess ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{msg}</span>
            <button onClick={() => setShow(false)} className="ml-auto opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AchievementsIndex({ achievements, filters }) {
    // Laravel paginator langsung: achievements.data, achievements.current_page, dll.
    const data = achievements?.data ?? [];
    const meta = {
        current_page: achievements?.current_page ?? 1,
        per_page:     achievements?.per_page     ?? 10,
    };

    const [search, setSearch]         = useState(filters?.search || '');
    const [type, setType]             = useState(filters?.type || '');
    const [category, setCategory]     = useState(filters?.category || '');
    const [sortBy, setSortBy]         = useState(filters?.sort_by || 'created_at');
    const [sortDir, setSortDir]       = useState(filters?.sort_dir || 'desc');
    const [perPage, setPerPage]       = useState(Number(filters?.per_page) || 10);
    const [selected, setSelected]     = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkConfirm, setBulkConfirm]   = useState(false);
    const [deleting, setDeleting]         = useState(false);

    const searchTimeout = useRef(null);

    const applyFilters = (overrides = {}) => {
        const params = {
            search:   search,
            type:     type,
            category: category,
            sort_by:  sortBy,
            sort_dir: sortDir,
            per_page: perPage,
            ...overrides,
        };
        // Remove empty
        Object.keys(params).forEach(k => !params[k] && delete params[k]);
        router.get('/admin/achievements', params, { preserveState: true, replace: true });
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => applyFilters({ search: value }), 400);
    };

    const handleSort = (field) => {
        const newDir = sortBy === field && sortDir === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortDir(newDir);
        applyFilters({ sort_by: field, sort_dir: newDir });
    };

    const handlePerPage = (value) => {
        setPerPage(value);
        applyFilters({ per_page: value });
    };

    const handleFilterSelect = (key, value) => {
        if (key === 'type') setType(value);
        if (key === 'category') setCategory(value);
        applyFilters({ [key]: value });
    };

    const resetFilters = () => {
        setSearch(''); setType(''); setCategory('');
        setSortBy('created_at'); setSortDir('desc'); setPerPage(10);
        router.get('/admin/achievements', {}, { replace: true });
    };

    const isAllSelected = data.length > 0 && selected.length === data.length;
    const toggleAll = () => setSelected(isAllSelected ? [] : data.map(a => a.id));
    const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/achievements/${deleteTarget}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    const handleBulkDelete = () => {
        setDeleting(true);
        router.delete('/admin/achievements', {
            data: { ids: selected },
            onFinish: () => { setDeleting(false); setBulkConfirm(false); setSelected([]); },
        });
    };

    const hasActiveFilters = search || type || category;

    const thClass = 'px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider whitespace-nowrap';
    const tdClass = 'px-4 py-3.5 text-[13px] text-white/70 align-middle';

    return (
        <AdminLayout title="Pencapaian">
            <Flash />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[20px] font-bold text-white">Pencapaian</h2>
                        <p className="text-[12.5px] text-white/35 mt-0.5">
                            Kelola sertifikat dan lencana
                        </p>
                    </div>
                    <Link href="/admin/achievements/create">
                        <Button>
                            <Plus className="w-4 h-4" />
                            Tambah
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari judul, penerbit..."
                            value={search}
                            onChange={e => handleSearchChange(e.target.value)}
                            className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                        />
                        {search && (
                            <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Type Filter */}
                    <select
                        value={type}
                        onChange={e => handleFilterSelect('type', e.target.value)}
                        className="h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-[13px] text-white/60 focus:outline-none focus:border-white/20 cursor-pointer appearance-none pr-8"
                    >
                        <option value="" className="bg-[#161616]">Semua Type</option>
                        {['Profesional', 'Course', 'Certificate', 'Badge'].map(t => (
                            <option key={t} value={t} className="bg-[#161616]">{t}</option>
                        ))}
                    </select>

                    {/* Category Filter */}
                    <select
                        value={category}
                        onChange={e => handleFilterSelect('category', e.target.value)}
                        className="h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-[13px] text-white/60 focus:outline-none focus:border-white/20 cursor-pointer appearance-none pr-8"
                    >
                        <option value="" className="bg-[#161616]">Semua Kategori</option>
                        {['Backend', 'Frontend', 'Mobile', 'DevOps', 'Design', 'Freelance'].map(c => (
                            <option key={c} value={c} className="bg-[#161616]">{c}</option>
                        ))}
                    </select>

                    {hasActiveFilters && (
                        <button onClick={resetFilters} className="flex items-center gap-1.5 h-9 px-3 text-[12.5px] text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.15] rounded-lg transition-all">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Reset
                        </button>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        <PerPageSelect value={perPage} onChange={handlePerPage} />
                    </div>
                </div>

                {/* Bulk Action Bar */}
                {selected.length > 0 && (
                    <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 animate-in fade-in duration-200">
                        <span className="text-[13px] text-indigo-300 font-medium">
                            {selected.length} item dipilih
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected([])} className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
                                Batal pilih
                            </button>
                            <Button variant="danger" size="sm" onClick={() => setBulkConfirm(true)}>
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus ({selected.length})
                            </Button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                                <tr>
                                    {/* Checkbox */}
                                    <th className="w-12 px-4 py-3">
                                        <button onClick={toggleAll} className="text-white/30 hover:text-white/60 transition-colors">
                                            {isAllSelected
                                                ? <CheckSquare className="w-4 h-4 text-indigo-400" />
                                                : <Square className="w-4 h-4" />
                                            }
                                        </button>
                                    </th>
                                    <th className={thClass}>#</th>
                                    <th className="w-16 px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                                        Thumb
                                    </th>
                                    {[
                                        { label: 'Judul', field: 'title' },
                                        { label: 'Penerbit', field: 'issuer' },
                                        { label: 'Type', field: 'type' },
                                        { label: 'Kategori', field: 'category' },
                                        { label: 'Tanggal', field: 'issued_date' },
                                    ].map(({ label, field }) => (
                                        <th
                                            key={field}
                                            className={`${thClass} cursor-pointer hover:text-white/60 transition-colors select-none`}
                                            onClick={() => handleSort(field)}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {label}
                                                <SortIcon field={field} current={sortBy} direction={sortDir} />
                                            </div>
                                        </th>
                                    ))}
                                    <th className={`${thClass} text-right`}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-16 text-white/25 text-[13px]">
                                            Tidak ada data ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((ach, idx) => (
                                        <tr
                                            key={ach.id}
                                            className={`transition-colors hover:bg-white/[0.02] ${selected.includes(ach.id) ? 'bg-indigo-500/[0.04]' : ''}`}
                                        >
                                            {/* Checkbox */}
                                            <td className="w-12 px-4 py-3.5">
                                                <button onClick={() => toggleOne(ach.id)} className="text-white/30 hover:text-white/60 transition-colors">
                                                    {selected.includes(ach.id)
                                                        ? <CheckSquare className="w-4 h-4 text-indigo-400" />
                                                        : <Square className="w-4 h-4" />
                                                    }
                                                </button>
                                            </td>

                                            {/* No */}
                                            <td className={tdClass}>
                                                <span className="text-white/25 font-mono text-[12px]">
                                                    {(meta.current_page - 1) * meta.per_page + idx + 1}
                                                </span>
                                            </td>

                                            {/* Thumbnail */}
                                            <td className="px-4 py-3.5">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                                    {ach.thumbnail ? (
                                                        <img src={ach.thumbnail} alt={ach.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageOff className="w-4 h-4 text-white/20" />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Title */}
                                            <td className={tdClass}>
                                                <div className="max-w-[220px]">
                                                    <p className="text-white/85 font-medium text-[13px] line-clamp-1">{ach.title}</p>
                                                    {ach.credential_id && (
                                                        <p className="text-[10.5px] text-white/25 font-mono mt-0.5">{ach.credential_id}</p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Issuer */}
                                            <td className={tdClass}>
                                                <span className="text-white/55">{ach.issuer}</span>
                                            </td>

                                            {/* Type */}
                                            <td className={tdClass}>
                                                <StatusBadge label={ach.type} />
                                            </td>

                                            {/* Category */}
                                            <td className={tdClass}>
                                                <StatusBadge label={ach.category} />
                                            </td>

                                            {/* Date */}
                                            <td className={tdClass}>
                                                <span className="text-white/40 font-mono text-[12px]">{ach.issued_date}</span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/admin/achievements/${ach.id}/edit`}>
                                                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-white/35 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteTarget(ach.id)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 pb-4">
                        <Pagination paginatorData={achievements} />
                    </div>
                </div>
            </div>

            {/* Delete single */}
            <ConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                message="Achievement ini akan dihapus permanen beserta thumbnail-nya."
            />

            {/* Bulk delete */}
            <ConfirmModal
                open={bulkConfirm}
                onClose={() => setBulkConfirm(false)}
                onConfirm={handleBulkDelete}
                loading={deleting}
                title={`Hapus ${selected.length} Achievement?`}
                message="Semua achievement yang dipilih akan dihapus permanen."
            />
        </AdminLayout>
    );
}