// resources/js/Pages/Admin/Achievements/Index.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, FlashToast, ConfirmModal, StatusBadge,
    FilterBar, BulkActionBar, TableCheckbox, ThumbnailCell,
    SortableTh, ActionButtons, ClientPagination
} from '@/Components/Admin/UI';
import { Plus, ImageOff, Pencil, Trash2 } from 'lucide-react';

// ─── Helper: Client Pagination ───────────────────────────────────────────────
const paginate = (array, page, perPage) => array.slice((page - 1) * perPage, page * perPage);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AchievementsIndex({ achievements }) {
    const allData = Array.isArray(achievements) ? achievements : [];
    
    // States
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkConfirm, setBulkConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const searchTimeout = useRef(null);

    // Reset page on filter change
    useEffect(() => { setCurrentPage(1); }, [search, type, category, sortBy, sortDir, perPage]);

    // Processed data with filter/sort
    const processedData = useMemo(() => {
        let result = [...allData];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(a => a.title?.toLowerCase().includes(q) || a.issuer?.toLowerCase().includes(q) || a.credential_id?.toLowerCase().includes(q));
        }
        if (type) result = result.filter(a => a.type === type);
        if (category) result = result.filter(a => a.category === category);
        
        result.sort((a, b) => {
            let valA = a[sortBy] ?? '', valB = b[sortBy] ?? '';
            if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [allData, search, type, category, sortBy, sortDir]);

    const paginatedData = paginate(processedData, currentPage, perPage);
    const totalPages = Math.ceil(processedData.length / perPage);
    const hasActiveFilters = search || type || category;

    // Handlers
    const handleSearch = (v) => { setSearch(v); clearTimeout(searchTimeout.current); searchTimeout.current = setTimeout(() => {}, 300); };
    const handleSort = (field) => { setSortDir(prev => sortBy === field && prev === 'asc' ? 'desc' : 'asc'); setSortBy(field); };
    const handleFilter = (key, val) => { if (key === 'type') setType(val); if (key === 'category') setCategory(val); };
    const handleReset = () => { setSearch(''); setType(''); setCategory(''); setSortBy('created_at'); setSortDir('desc'); setPerPage(10); setCurrentPage(1); };
    
    const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
    const toggleAll = () => setSelected(isAllSelected ? [] : paginatedData.map(a => a.id));
    const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/achievements/${deleteTarget}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
            onSuccess: () => router.reload({ only: ['achievements'] }),
        });
    };
    const handleBulkDelete = () => {
        setDeleting(true);
        router.delete('/admin/achievements', {
            data: { ids: selected },
            onFinish: () => { setDeleting(false); setBulkConfirm(false); setSelected([]); },
            onSuccess: () => router.reload({ only: ['achievements'] }),
        });
    };

    const columns = [
        { label: 'Judul', field: 'title', render: (a) => <><p className="text-white/85 font-medium text-[13px] line-clamp-1">{a.title}</p>{a.credential_id && <p className="text-[10.5px] text-white/25 font-mono mt-0.5">{a.credential_id}</p>}</> },
        { label: 'Penerbit', field: 'issuer', render: (a) => <span className="text-white/55">{a.issuer}</span> },
        { label: 'Type', field: 'type', render: (a) => <StatusBadge label={a.type} /> },
        { label: 'Kategori', field: 'category', render: (a) => <StatusBadge label={a.category} /> },
        { label: 'Tanggal', field: 'issued_date', render: (a) => <span className="text-white/40 font-mono text-[12px]">{a.issued_date}</span> },
    ];

    return (
        <AdminLayout title="Pencapaian">
            <FlashToast />
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div><h2 className="text-[20px] font-bold text-white">Pencapaian</h2><p className="text-[12.5px] text-white/35 mt-0.5">Kelola sertifikat dan lencana</p></div>
                    <Link href="/admin/achievements/create"><Button><Plus className="w-4 h-4" />Tambah</Button></Link>
                </div>

                {/* Filters */}
                <FilterBar 
                    search={search} onSearchChange={handleSearch}
                    filters={[
                        { key: 'type', value: type, options: ['Profesional','Course','Certificate','Badge'], placeholder: 'Semua Type' },
                        { key: 'category', value: category, options: ['Backend','Frontend','Mobile','DevOps','Design','Freelance'], placeholder: 'Semua Kategori' },
                    ]}
                    onFilterChange={handleFilter} onReset={handleReset}
                    perPage={perPage} onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }}
                    hasActiveFilters={hasActiveFilters}
                    searchPlaceholder="Cari judul, penerbit..."
                />

                {/* Bulk Actions */}
                <BulkActionBar count={selected.length} onCancel={() => setSelected([])} onDelete={() => setBulkConfirm(true)} loading={deleting} />

                {/* Table */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                                <tr>
                                    <th className="w-12 px-4 py-3"><TableCheckbox checked={isAllSelected} onChange={toggleAll} /></th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">#</th>
                                    <th className="w-16 px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">Thumb</th>
                                    {columns.map(col => <SortableTh key={col.field} label={col.label} field={col.field} currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />)}
                                    <th className="px-4 py-3 text-right text-[11px] font-medium text-white/30 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {paginatedData.length === 0 ? (
                                    <tr><td colSpan={columns.length + 4} className="text-center py-16 text-white/25 text-[13px]">{hasActiveFilters ? 'Tidak ada data yang cocok dengan filter' : 'Tidak ada data ditemukan'}</td></tr>
                                ) : paginatedData.map((ach, idx) => (
                                    <tr key={ach.id} className={`transition-colors hover:bg-white/[0.02] ${selected.includes(ach.id) ? 'bg-indigo-500/[0.04]' : ''}`}>
                                        <td className="w-12 px-4 py-3.5"><TableCheckbox checked={selected.includes(ach.id)} onChange={() => toggleOne(ach.id)} /></td>
                                        <td className="px-4 py-3.5 text-[13px] text-white/70"><span className="text-white/25 font-mono text-[12px]">{(currentPage - 1) * perPage + idx + 1}</span></td>
                                        <td className="px-4 py-3.5"><ThumbnailCell src={ach.thumbnail} alt={ach.title} fallbackIcon={ImageOff} /></td>
                                        {columns.map(col => <td key={col.field} className="px-4 py-3.5 text-[13px] text-white/70 align-middle">{col.render(ach)}</td>)}
                                        <td className="px-4 py-3.5 text-right"><ActionButtons editUrl={`/admin/achievements/${ach.id}/edit`} onDelete={() => setDeleteTarget(ach.id)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 pb-4"><ClientPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={processedData.length} perPage={perPage} /></div>
                </div>
            </div>

            <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message="Achievement ini akan dihapus permanen beserta thumbnail-nya." />
            <ConfirmModal open={bulkConfirm} onClose={() => setBulkConfirm(false)} onConfirm={handleBulkDelete} loading={deleting} title={`Hapus ${selected.length} Achievement?`} message="Semua achievement yang dipilih akan dihapus permanen." />
        </AdminLayout>
    );
}