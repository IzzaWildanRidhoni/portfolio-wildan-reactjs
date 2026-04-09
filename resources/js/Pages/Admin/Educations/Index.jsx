// resources/js/Pages/Admin/Educations/Index.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, FlashToast, ConfirmModal, StatusBadge,
    FilterBar, BulkActionBar, TableCheckbox, ThumbnailCell,
    SortableTh, ActionButtons, ClientPagination
} from '@/Components/Admin/UI';
import { Plus, ImageOff, Pencil, Trash2 } from 'lucide-react';

const paginate = (array, page, perPage) => array.slice((page - 1) * perPage, page * perPage);

export default function EducationsIndex({ educations }) {
    const allData = Array.isArray(educations) ? educations : [];
    
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('');
    const [sortBy, setSortBy] = useState('start_year');
    const [sortDir, setSortDir] = useState('desc');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkConfirm, setBulkConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const searchTimeout = useRef(null);
    useEffect(() => { setCurrentPage(1); }, [search, level, sortBy, sortDir, perPage]);

    const processedData = useMemo(() => {
        let result = [...allData];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(e => e.institution?.toLowerCase().includes(q) || e.degree?.toLowerCase().includes(q) || e.field?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q));
        }
        if (level) result = result.filter(e => e.level === level);
        
        result.sort((a, b) => {
            let valA = a[sortBy] ?? '', valB = b[sortBy] ?? '';
            if (['start_year','end_year','gpa'].includes(sortBy)) {
                valA = Number(valA) || 0; valB = Number(valB) || 0;
                return sortDir === 'asc' ? valA - valB : valB - valA;
            }
            if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [allData, search, level, sortBy, sortDir]);

    const paginatedData = paginate(processedData, currentPage, perPage);
    const totalPages = Math.ceil(processedData.length / perPage);
    const hasActiveFilters = search || level;

    const handleSearch = (v) => { setSearch(v); clearTimeout(searchTimeout.current); searchTimeout.current = setTimeout(() => {}, 300); };
    const handleSort = (field) => { setSortDir(prev => sortBy === field && prev === 'asc' ? 'desc' : 'asc'); setSortBy(field); };
    const handleFilter = (key, val) => { if (key === 'level') setLevel(val); };
    const handleReset = () => { setSearch(''); setLevel(''); setSortBy('start_year'); setSortDir('desc'); setPerPage(10); setCurrentPage(1); };
    
    const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
    const toggleAll = () => setSelected(isAllSelected ? [] : paginatedData.map(e => e.id));
    const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

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

    const columns = [
        { label: 'Institusi', field: 'institution', render: (e) => <><p className="text-white/85 font-medium text-[13px] line-clamp-1">{e.institution}</p>{e.gpa && <p className="text-[10.5px] text-white/40 mt-0.5">IPK: {e.gpa}</p>}</> },
        { label: 'Gelar', field: 'degree', render: (e) => <span className="text-white/55">{e.degree}</span> },
        { label: 'Jurusan', field: 'field', render: (e) => <span className="text-white/55">{e.field}</span> },
        { label: 'Level', field: 'level', render: (e) => <StatusBadge label={e.level} /> },
        { label: 'Periode', field: 'start_year', render: (e) => <span className="text-white/40 font-mono text-[12px]">{e.start_year} {e.end_year ? `- ${e.end_year}` : '- Sekarang'}</span> },
        { label: 'Lokasi', field: 'location', render: (e) => <span className="text-white/55">{e.location}</span> },
    ];

    return (
        <AdminLayout title="Pendidikan">
            <FlashToast />
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div><h2 className="text-[20px] font-bold text-white">Pendidikan</h2><p className="text-[12.5px] text-white/35 mt-0.5">Kelola riwayat pendidikan dan sertifikasi</p></div>
                    <Link href="/admin/educations/create"><Button><Plus className="w-4 h-4" />Tambah</Button></Link>
                </div>

                {/* Filters */}
                <FilterBar 
                    search={search} onSearchChange={handleSearch}
                    filters={[
                        { key: 'level', value: level, options: ['SMA','SMK','D3','S1','S2','S3','Professional','Certification'], placeholder: 'Semua Level' },
                    ]}
                    onFilterChange={handleFilter} onReset={handleReset}
                    perPage={perPage} onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }}
                    hasActiveFilters={hasActiveFilters}
                    searchPlaceholder="Cari institusi, jurusan..."
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
                                    <th className="w-16 px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">Logo</th>
                                    {columns.map(col => <SortableTh key={col.field} label={col.label} field={col.field} currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />)}
                                    <th className="px-4 py-3 text-right text-[11px] font-medium text-white/30 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {paginatedData.length === 0 ? (
                                    <tr><td colSpan={columns.length + 4} className="text-center py-16 text-white/25 text-[13px]">{hasActiveFilters ? 'Tidak ada data yang cocok dengan filter' : 'Tidak ada data ditemukan'}</td></tr>
                                ) : paginatedData.map((edu, idx) => (
                                    <tr key={edu.id} className={`transition-colors hover:bg-white/[0.02] ${selected.includes(edu.id) ? 'bg-indigo-500/[0.04]' : ''}`}>
                                        <td className="w-12 px-4 py-3.5"><TableCheckbox checked={selected.includes(edu.id)} onChange={() => toggleOne(edu.id)} /></td>
                                        <td className="px-4 py-3.5 text-[13px] text-white/70"><span className="text-white/25 font-mono text-[12px]">{(currentPage - 1) * perPage + idx + 1}</span></td>
                                        <td className="px-4 py-3.5"><ThumbnailCell src={edu.logo} alt={edu.institution} fallbackIcon={ImageOff} /></td>
                                        {columns.map(col => <td key={col.field} className="px-4 py-3.5 text-[13px] text-white/70 align-middle">{col.render(edu)}</td>)}
                                        <td className="px-4 py-3.5 text-right"><ActionButtons editUrl={`/admin/educations/${edu.id}/edit`} onDelete={() => setDeleteTarget(edu.id)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 pb-4"><ClientPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={processedData.length} perPage={perPage} /></div>
                </div>
            </div>

            <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message="Education ini akan dihapus permanen beserta logonya." />
            <ConfirmModal open={bulkConfirm} onClose={() => setBulkConfirm(false)} onConfirm={handleBulkDelete} loading={deleting} title={`Hapus ${selected.length} Education?`} message="Semua education yang dipilih akan dihapus permanen." />
        </AdminLayout>
    );
}