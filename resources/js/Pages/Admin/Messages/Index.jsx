// resources/js/Pages/Admin/Messages/Index.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Button, FlashToast, ConfirmModal, StatusBadge,
    FilterBar, BulkActionBar, TableCheckbox, 
    SortableTh, ActionButtons, ClientPagination
} from '@/Components/Admin/UI';
import { 
    Mail, MailOpen, Eye, Trash2, RefreshCw, 
    Search, User, Calendar, Globe 
} from 'lucide-react';

// ─── Helper: Client Pagination ───────────────────────────────────────────────
const paginate = (array, page, perPage) => array.slice((page - 1) * perPage, page * perPage);

// ─── Status Badge Helper ─────────────────────────────────────────────────────
function ReadStatusBadge({ readAt }) {
    return readAt 
        ? <StatusBadge label="Dibaca" customClass="bg-emerald-500/15 text-emerald-400 border-emerald-500/20" />
        : <StatusBadge label="Baru" customClass="bg-amber-500/15 text-amber-400 border-amber-500/20 animate-pulse" />;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MessagesIndex({ messages }) {
    const allData = Array.isArray(messages) ? messages : [];
    
    // States
    const [search, setSearch] = useState('');
    const [readStatus, setReadStatus] = useState(''); // '', 'read', 'unread'
    const [sortBy, setSortBy] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkConfirm, setBulkConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);

    const searchTimeout = useRef(null);

    // Reset page on filter change
    useEffect(() => { setCurrentPage(1); }, [search, readStatus, sortBy, sortDir, perPage]);

    // Processed data with filter/sort
    const processedData = useMemo(() => {
        let result = [...allData];
        
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(m => 
                m.name?.toLowerCase().includes(q) || 
                m.email?.toLowerCase().includes(q) || 
                m.subject?.toLowerCase().includes(q) ||
                m.message?.toLowerCase().includes(q)
            );
        }
        if (readStatus === 'read') result = result.filter(m => m.read_at);
        if (readStatus === 'unread') result = result.filter(m => !m.read_at);
        
        result.sort((a, b) => {
            let valA = a[sortBy] ?? '', valB = b[sortBy] ?? '';
            if (sortBy === 'read_at') {
                valA = valA ? new Date(valA).getTime() : 0;
                valB = valB ? new Date(valB).getTime() : 0;
            }
            if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [allData, search, readStatus, sortBy, sortDir]);

    const paginatedData = paginate(processedData, currentPage, perPage);
    const totalPages = Math.ceil(processedData.length / perPage);
    const hasActiveFilters = search || readStatus;
    const unreadCount = allData.filter(m => !m.read_at).length;

    // Handlers
    const handleSearch = (v) => { 
        setSearch(v); 
        clearTimeout(searchTimeout.current); 
        searchTimeout.current = setTimeout(() => {}, 300); 
    };
    const handleSort = (field) => { 
        setSortDir(prev => sortBy === field && prev === 'asc' ? 'desc' : 'asc'); 
        setSortBy(field); 
    };
    const handleFilter = (key, val) => { 
        if (key === 'readStatus') setReadStatus(val); 
    };
    const handleReset = () => { 
        setSearch(''); setReadStatus(''); setSortBy('created_at'); setSortDir('desc'); setPerPage(10); setCurrentPage(1); 
    };
    
    const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
    const toggleAll = () => setSelected(isAllSelected ? [] : paginatedData.map(m => m.id));
    const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(`/admin/messages/${deleteTarget}`, {
            onFinish: () => { setProcessing(false); setDeleteTarget(null); },
            onSuccess: () => router.reload({ only: ['messages'] }),
        });
    };

    const handleBulkDelete = () => {
        setProcessing(true);
        router.delete('/admin/messages/bulk-destroy', {
            data: { ids: selected },
            onFinish: () => { setProcessing(false); setBulkConfirm(false); setSelected([]); },
            onSuccess: () => router.reload({ only: ['messages'] }),
        });
    };

    const handleBulkMarkRead = () => {
        setProcessing(true);
        router.post('/admin/messages/bulk-mark-read', {
            ids: selected,
        }, {
            onFinish: () => { setProcessing(false); setSelected([]); },
            onSuccess: () => router.reload({ only: ['messages'] }),
        });
    };

    const columns = [
        { 
            label: 'Pesan', 
            field: 'subject', 
            render: (m) => (
                <div>
                    <p className="text-white/85 font-medium text-[13px] line-clamp-1">{m.subject || '(Tanpa Subjek)'}</p>
                    <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1">{m.preview}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-white/50 flex items-center gap-1">
                            <User className="w-2.5 h-2.5" />{m.name}
                        </span>
                        <span className="text-[11px] text-white/30">•</span>
                        <span className="text-[11px] text-white/50 flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" />{m.email}
                        </span>
                    </div>
                </div>
            ) 
        },
        { 
            label: 'Status', 
            field: 'read_at', 
            render: (m) => <ReadStatusBadge readAt={m.read_at} /> 
        },
        { 
            label: 'Tanggal', 
            field: 'created_at', 
            render: (m) => (
                <span className="text-white/40 font-mono text-[12px]">
                    {new Date(m.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            ) 
        },
        { 
            label: 'IP Address', 
            field: 'ip_address', 
            render: (m) => (
                <span className="text-white/30 font-mono text-[11px] flex items-center gap-1">
                    <Globe className="w-3 h-3" />{m.ip_address}
                </span>
            ) 
        },
    ];

    return (
        <AdminLayout title="Pesan Masuk">
            <FlashToast />
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[20px] font-bold text-white">Pesan Masuk</h2>
                        <p className="text-[12.5px] text-white/35 mt-0.5">
                            {unreadCount > 0 && <span className="text-amber-400">{unreadCount} pesan baru • </span>}
                            Total {allData.length} pesan
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="secondary" size="sm" onClick={() => setReadStatus('unread')}>
                            <Mail className="w-3.5 h-3.5" />
                            Tampilkan Belum Dibaca
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <FilterBar 
                    search={search} onSearchChange={handleSearch}
                    filters={[
                        { 
                            key: 'readStatus', 
                            value: readStatus, 
                            options: [
                                { value: 'unread', label: 'Belum Dibaca' },
                                { value: 'read', label: 'Sudah Dibaca' },
                            ], 
                            placeholder: 'Semua Status' 
                        },
                    ]}
                    onFilterChange={handleFilter} onReset={handleReset}
                    perPage={perPage} onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }}
                    hasActiveFilters={hasActiveFilters}
                    searchPlaceholder="Cari nama, email, subjek..."
                />

                {/* Bulk Actions */}
                <BulkActionBar 
                    count={selected.length} 
                    onCancel={() => setSelected([])} 
                    onDelete={() => setBulkConfirm(true)} 
                    loading={processing}
                    className="flex-wrap gap-2"
                >
                    {selected.length > 0 && (
                        <Button variant="secondary" size="sm" onClick={handleBulkMarkRead} loading={processing}>
                            <MailOpen className="w-3.5 h-3.5" />
                            Tandai Dibaca ({selected.length})
                        </Button>
                    )}
                </BulkActionBar>

                {/* Table */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                                <tr>
                                    <th className="w-12 px-4 py-3"><TableCheckbox checked={isAllSelected} onChange={toggleAll} /></th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">#</th>
                                    {columns.map(col => (
                                        <SortableTh key={col.field} label={col.label} field={col.field} currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    ))}
                                    <th className="px-4 py-3 text-right text-[11px] font-medium text-white/30 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 3} className="text-center py-16 text-white/25 text-[13px]">
                                            {hasActiveFilters ? 'Tidak ada pesan yang cocok dengan filter' : 'Tidak ada pesan ditemukan'}
                                        </td>
                                    </tr>
                                ) : paginatedData.map((msg, idx) => (
                                    <tr 
                                        key={msg.id} 
                                        className={`transition-colors hover:bg-white/[0.02] cursor-pointer ${
                                            selected.includes(msg.id) ? 'bg-indigo-500/[0.04]' : ''
                                        } ${!msg.read_at ? 'bg-amber-500/[0.02]' : ''}`}
                                        onClick={() => router.visit(`/admin/messages/${msg.id}`)}
                                    >
                                        <td className="w-12 px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                            <TableCheckbox checked={selected.includes(msg.id)} onChange={() => toggleOne(msg.id)} />
                                        </td>
                                        <td className="px-4 py-3.5 text-[13px] text-white/70" onClick={e => e.stopPropagation()}>
                                            <span className="text-white/25 font-mono text-[12px]">{(currentPage - 1) * perPage + idx + 1}</span>
                                        </td>
                                        {columns.map(col => (
                                            <td key={col.field} className="px-4 py-3.5 text-[13px] text-white/70 align-middle" onClick={e => e.stopPropagation()}>
                                                {col.render(msg)}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                                            <ActionButtons 
                                                editUrl={`/admin/messages/${msg.id}`}
                                                onDelete={(e) => { e?.stopPropagation?.(); setDeleteTarget(msg.id); }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 pb-4">
                        <ClientPagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={setCurrentPage} 
                            totalItems={processedData.length} 
                            perPage={perPage} 
                        />
                    </div>
                </div>
            </div>

            {/* Confirm Modals */}
            <ConfirmModal 
                open={!!deleteTarget} 
                onClose={() => setDeleteTarget(null)} 
                onConfirm={handleDelete} 
                loading={processing} 
                message="Pesan ini akan dihapus (soft delete) dan dapat dipulihkan nanti." 
            />
            <ConfirmModal 
                open={bulkConfirm} 
                onClose={() => setBulkConfirm(false)} 
                onConfirm={handleBulkDelete} 
                loading={processing} 
                title={`Hapus ${selected.length} Pesan?`} 
                message="Semua pesan yang dipilih akan dihapus (soft delete) dan dapat dipulihkan nanti." 
            />
        </AdminLayout>
    );
}