// resources/js/Pages/Admin/Educations/Index.jsx

import { useState, useMemo, useRef, useEffect } from 'react'; // ⬅️ Tambah useMemo
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, StatusBadge, ConfirmModal } from '@/Components/Admin/UI'; // ⬅️ Hapus Pagination
import {
    Plus, Search, Trash2, Pencil, ChevronDown, ChevronUp,
    ChevronsUpDown, ImageOff, X, RefreshCw,
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

// ─── Helper: Client-side Pagination ───────────────────────────────────────────
function paginate(array, page, perPage) {
    const start = (page - 1) * perPage;
    return array.slice(start, start + perPage);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EducationsIndex({ educations }) {
    // educations sekarang adalah array collection, bukan paginator
    const allData = Array.isArray(educations) ? educations : [];

    // ─── States untuk Filter & Sort ─────────────────────────────────────
    const [search, setSearch]     = useState('');
    const [level, setLevel]       = useState('');
    const [sortBy, setSortBy]     = useState('start_year');
    const [sortDir, setSortDir]   = useState('desc');
    const [perPage, setPerPage]   = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [selected, setSelected] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkConfirm, setBulkConfirm]   = useState(false);
    const [deleting, setDeleting]         = useState(false);

    const searchTimeout = useRef(null);

    // ─── Reset page saat filter berubah ─────────────────────────────────
    useEffect(() => {
        setCurrentPage(1);
    }, [search, level, sortBy, sortDir, perPage]);

    // ─── Filtered & Sorted Data (Memoized) ──────────────────────────────
    const processedData = useMemo(() => {
        let result = [...allData];

        // Search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(e => 
                e.institution?.toLowerCase().includes(q) ||
                e.degree?.toLowerCase().includes(q) ||
                e.field?.toLowerCase().includes(q) ||
                e.location?.toLowerCase().includes(q)
            );
        }

        // Level filter
        if (level) {
            result = result.filter(e => e.level === level);
        }

        // Sorting
        result.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];
            
            // Handle null/undefined
            if (valA == null) valA = '';
            if (valB == null) valB = '';
            
            // Special handling for year fields (numeric comparison)
            if (['start_year', 'end_year', 'gpa'].includes(sortBy)) {
                valA = Number(valA) || 0;
                valB = Number(valB) || 0;
                return sortDir === 'asc' ? valA - valB : valB - valA;
            }
            
            // Case-insensitive string comparison
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [allData, search, level, sortBy, sortDir]);

    // ─── Pagination Data ────────────────────────────────────────────────
    const totalPages = Math.ceil(processedData.length / perPage);
    const paginatedData = paginate(processedData, currentPage, perPage);

    // ─── Handlers ───────────────────────────────────────────────────────
    const handleSearchChange = (value) => {
        setSearch(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {}, 400); // Debounce untuk UX
    };

    const handleSort = (field) => {
        const newDir = sortBy === field && sortDir === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortDir(newDir);
    };

    const handlePerPage = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    };

    const handleFilterSelect = (key, value) => {
        if (key === 'level') setLevel(value);
    };

    const resetFilters = () => {
        setSearch(''); setLevel('');
        setSortBy('start_year'); setSortDir('desc'); setPerPage(10);
        setCurrentPage(1);
    };

    // ─── Selection Logic ────────────────────────────────────────────────
    const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
    const toggleAll = () => setSelected(isAllSelected ? [] : paginatedData.map(e => e.id));
    const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    // ─── Delete Handlers (masih ke server untuk mutate data) ────────────
    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/educations/${deleteTarget}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
            onSuccess: () => router.reload({ only: ['educations'] }),
        });
    };

    const handleBulkDelete = () => {
        setDeleting(true);
        router.delete('/admin/educations', {
            data: { ids: selected },
            onFinish: () => { setDeleting(false); setBulkConfirm(false); setSelected([]); },
            onSuccess: () => router.reload({ only: ['educations'] }),
        });
    };

    const hasActiveFilters = search || level;

    const thClass = 'px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider whitespace-nowrap';
    const tdClass = 'px-4 py-3.5 text-[13px] text-white/70 align-middle';

    // Level badge colors
    const levelColors = {
        'SMA': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        'SMK': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
        'D3': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
        'S1': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        'S2': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
        'S3': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
        'Professional': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
        'Certification': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    };

    return (
        <AdminLayout title="Pendidikan">
            <Flash />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[20px] font-bold text-white">Pendidikan</h2>
                        <p className="text-[12.5px] text-white/35 mt-0.5">
                            Kelola riwayat pendidikan dan sertifikasi
                        </p>
                    </div>
                    <Link href="/admin/educations/create">
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
                            placeholder="Cari institusi, jurusan..."
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

                    {/* Level Filter */}
                    <select
                        value={level}
                        onChange={e => handleFilterSelect('level', e.target.value)}
                        className="h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-[13px] text-white/60 focus:outline-none focus:border-white/20 cursor-pointer appearance-none pr-8"
                    >
                        <option value="" className="bg-[#161616]">Semua Level</option>
                        {['SMA', 'SMK', 'D3', 'S1', 'S2', 'S3', 'Professional', 'Certification'].map(l => (
                            <option key={l} value={l} className="bg-[#161616]">{l}</option>
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
                                    <th className="w-12 px-4 py-3">
                                        <button onClick={toggleAll} className="text-white/30 hover:text-white/60 transition-colors">
                                            {isAllSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
                                        </button>
                                    </th>
                                    <th className={thClass}>#</th>
                                    <th className="w-16 px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Logo</th>
                                    {[
                                        { label: 'Institusi', field: 'institution' },
                                        { label: 'Gelar', field: 'degree' },
                                        { label: 'Jurusan', field: 'field' },
                                        { label: 'Level', field: 'level' },
                                        { label: 'Periode', field: 'start_year' },
                                        { label: 'Lokasi', field: 'location' },
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
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-16 text-white/25 text-[13px]">
                                            {hasActiveFilters ? 'Tidak ada data yang cocok dengan filter' : 'Tidak ada data ditemukan'}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((edu, idx) => (
                                        <tr
                                            key={edu.id}
                                            className={`transition-colors hover:bg-white/[0.02] ${selected.includes(edu.id) ? 'bg-indigo-500/[0.04]' : ''}`}
                                        >
                                            <td className="w-12 px-4 py-3.5">
                                                <button onClick={() => toggleOne(edu.id)} className="text-white/30 hover:text-white/60 transition-colors">
                                                    {selected.includes(edu.id) ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
                                                </button>
                                            </td>
                                            <td className={tdClass}>
                                                <span className="text-white/25 font-mono text-[12px]">
                                                    {(currentPage - 1) * perPage + idx + 1}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                                    {edu.logo ? (
                                                        <img src={edu.logo} alt={edu.institution} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageOff className="w-4 h-4 text-white/20" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className={tdClass}>
                                                <div className="max-w-[180px]">
                                                    <p className="text-white/85 font-medium text-[13px] line-clamp-1">{edu.institution}</p>
                                                    {edu.gpa && <p className="text-[10.5px] text-white/40 mt-0.5">IPK: {edu.gpa}</p>}
                                                </div>
                                            </td>
                                            <td className={tdClass}>
                                                <span className="text-white/55">{edu.degree}</span>
                                            </td>
                                            <td className={tdClass}>
                                                <span className="text-white/55">{edu.field}</span>
                                            </td>
                                            <td className={tdClass}>
                                                <span className={`inline-flex items-center text-[10.5px] font-medium px-2 py-0.5 rounded-full border ${levelColors[edu.level] || 'bg-white/10 text-white/50 border-white/10'}`}>
                                                    {edu.level}
                                                </span>
                                            </td>
                                            <td className={tdClass}>
                                                <span className="text-white/40 font-mono text-[12px]">
                                                    {edu.start_year} {edu.end_year ? `- ${edu.end_year}` : '- Sekarang'}
                                                </span>
                                            </td>
                                            <td className={tdClass}>
                                                <span className="text-white/55">{edu.location}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/admin/educations/${edu.id}/edit`}>
                                                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-white/35 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteTarget(edu.id)}
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

                    {/* Pagination - Custom Client-side */}
                    {totalPages > 1 && (
                        <div className="px-4 pb-4">
                            <div className="flex items-center justify-between text-[12px] text-white/40">
                                <span>
                                    Menampilkan {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, processedData.length)} dari {processedData.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Prev
                                    </button>
                                    
                                    {/* Page Numbers - Smart Ellipsis */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            if (page === 1 || page === totalPages) return true;
                                            return Math.abs(page - currentPage) <= 2;
                                        })
                                        .reduce((acc, page, idx, arr) => {
                                            if (idx > 0 && page - arr[idx - 1] > 1) {
                                                acc.push('...');
                                            }
                                            acc.push(page);
                                            return acc;
                                        }, [])
                                        .map((page, idx) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${idx}`} className="px-2 py-1.5">...</span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 rounded-lg transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                                            : 'hover:bg-white/[0.04] border border-transparent'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                    
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete single */}
            <ConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                message="Education ini akan dihapus permanen beserta logonya."
            />

            {/* Bulk delete */}
            <ConfirmModal
                open={bulkConfirm}
                onClose={() => setBulkConfirm(false)}
                onConfirm={handleBulkDelete}
                loading={deleting}
                title={`Hapus ${selected.length} Education?`}
                message="Semua education yang dipilih akan dihapus permanen."
            />
        </AdminLayout>
    );
}