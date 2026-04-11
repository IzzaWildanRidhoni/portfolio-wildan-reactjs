import { useState, useMemo, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Button, FlashToast, ConfirmModal, StatusBadge,
    FilterBar, BulkActionBar, TableCheckbox, ThumbnailCell,
    SortableTh, ActionButtons, ClientPagination,
} from '@/Components/Admin/UI';
import { Plus, ImageOff, Eye, Calendar, Tag, Globe } from 'lucide-react';

const paginate = (array, page, perPage) =>
    array.slice((page - 1) * perPage, page * perPage);

export default function BlogsIndex({ blogs }) {
    const allData = Array.isArray(blogs) ? blogs : [];

    const [search, setSearch]           = useState('');
    const [status, setStatus]           = useState('');
    const [sortBy, setSortBy]           = useState('order');
    const [sortDir, setSortDir]         = useState('asc');
    const [perPage, setPerPage]         = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected]       = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkConfirm, setBulkConfirm] = useState(false);
    const [deleting, setDeleting]       = useState(false);

    useEffect(() => { setCurrentPage(1); }, [search, status, sortBy, sortDir, perPage]);

    const processedData = useMemo(() => {
        let result = [...allData];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(b =>
                b.title?.toLowerCase().includes(q) ||
                b.excerpt?.toLowerCase().includes(q) ||
                b.tags?.some(t => t.toLowerCase().includes(q))
            );
        }
        if (status === 'published') result = result.filter(b => b.is_published);
        if (status === 'draft') result = result.filter(b => !b.is_published);

        result.sort((a, b) => {
            let valA = a[sortBy] ?? '', valB = b[sortBy] ?? '';
            if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [allData, search, status, sortBy, sortDir]);

    const paginatedData = paginate(processedData, currentPage, perPage);
    const totalPages = Math.ceil(processedData.length / perPage);
    const hasActiveFilters = search || status;

    const handleSort = (field) => { setSortDir(p => sortBy === field && p === 'asc' ? 'desc' : 'asc'); setSortBy(field); };
    const handleFilter = (key, val) => { if (key === 'status') setStatus(val); };
    const handleReset = () => { setSearch(''); setStatus(''); setSortBy('order'); setSortDir('asc'); setPerPage(10); setCurrentPage(1); };

    const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
    const toggleAll = () => setSelected(isAllSelected ? [] : paginatedData.map(b => b.id));
    const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/blogs/${deleteTarget}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    const handleBulkDelete = () => {
        setDeleting(true);
        router.delete('/admin/blogs', {
            data: { ids: selected },
            onFinish: () => { setDeleting(false); setBulkConfirm(false); setSelected([]); },
        });
    };

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <AdminLayout title="Blog Posts">
            <FlashToast />
            <div className="space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[20px] font-bold text-white">Blog Posts</h2>
                        <p className="text-[12.5px] text-white/35 mt-0.5">Kelola artikel dan konten blog</p>
                    </div>
                    <Link href="/admin/blogs/create">
                        <Button><Plus className="w-4 h-4" />Tambah Artikel</Button>
                    </Link>
                </div>

                {/* Filters */}
                <FilterBar
                    search={search} onSearchChange={setSearch}
                    filters={[
                        {
                            key: 'status', value: status,
                            options: [
                                { value: 'published', label: '✅ Published' },
                                { value: 'draft', label: '📝 Draft' },
                            ],
                            placeholder: 'Semua Status',
                        },
                    ]}
                    onFilterChange={handleFilter} onReset={handleReset}
                    perPage={perPage} onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }}
                    hasActiveFilters={hasActiveFilters}
                    searchPlaceholder="Cari judul, excerpt, tags..."
                />

                {/* Bulk Actions */}
                <BulkActionBar
                    count={selected.length}
                    onCancel={() => setSelected([])}
                    onDelete={() => setBulkConfirm(true)}
                    loading={deleting}
                />

                {/* Table */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                                <tr>
                                    <th className="w-12 px-4 py-3">
                                        <TableCheckbox checked={isAllSelected} onChange={toggleAll} />
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">#</th>
                                    <th className="w-16 px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">Thumb</th>
                                    <SortableTh label="Judul" field="title" currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">Tags</th>
                                    <SortableTh label="Status" field="is_published" currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableTh label="Published" field="published_at" currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableTh label="Views" field="views" currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <th className="px-4 py-3 text-right text-[11px] font-medium text-white/30 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-white/25 text-[13px]">
                                            {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada artikel blog'}
                                        </td>
                                    </tr>
                                ) : paginatedData.map((blog, idx) => (
                                    <tr
                                        key={blog.id}
                                        className={`transition-colors hover:bg-white/[0.02] ${selected.includes(blog.id) ? 'bg-indigo-500/[0.04]' : ''}`}
                                    >
                                        <td className="w-12 px-4 py-3.5">
                                            <TableCheckbox checked={selected.includes(blog.id)} onChange={() => toggleOne(blog.id)} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-white/25 font-mono text-[12px]">
                                                {(currentPage - 1) * perPage + idx + 1}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <ThumbnailCell src={blog.thumbnail} alt={blog.title} fallbackIcon={ImageOff} />
                                        </td>
                                        <td className="px-4 py-3.5 max-w-[240px]">
                                            <p className="text-white/85 font-medium text-[13px] line-clamp-1">{blog.title}</p>
                                            {blog.excerpt && (
                                                <p className="text-[11px] text-white/25 mt-0.5 line-clamp-1">
                                                    {blog.excerpt.replace(/<[^>]*>/g, ' ').substring(0, 70)}...
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                {(blog.tags || []).slice(0, 3).map(tag => (
                                                    <span key={tag} className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50 border border-white/[0.06]">
                                                        <Tag className="w-2.5 h-2.5 mr-0.5" />{tag}
                                                    </span>
                                                ))}
                                                {(blog.tags || []).length > 3 && (
                                                    <span className="text-[10px] text-white/30">+{blog.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {blog.is_published
                                                ? <StatusBadge label="Published" customClass="bg-emerald-500/15 text-emerald-400 border-emerald-500/20" />
                                                : <StatusBadge label="Draft" customClass="bg-white/[0.06] text-white/40 border-white/[0.1]" />
                                            }
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1.5 text-[12px] text-white/40">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(blog.published_at)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1.5 text-[12px] text-white/40">
                                                <Eye className="w-3.5 h-3.5" />
                                                {blog.views || 0}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <ActionButtons
                                                editUrl={`/admin/blogs/${blog.id}/edit`}
                                                onDelete={() => setDeleteTarget(blog.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 pb-4">
                        <ClientPagination
                            currentPage={currentPage} totalPages={totalPages}
                            onPageChange={setCurrentPage} totalItems={processedData.length}
                            perPage={perPage}
                        />
                    </div>
                </div>
            </div>

            {/* Delete modals */}
            <ConfirmModal
                open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete} loading={deleting}
                message="Blog ini akan dihapus permanen beserta thumbnail-nya."
            />
            <ConfirmModal
                open={bulkConfirm} onClose={() => setBulkConfirm(false)}
                onConfirm={handleBulkDelete} loading={deleting}
                title={`Hapus ${selected.length} Blog?`}
                message="Semua artikel yang dipilih akan dihapus permanen."
            />
        </AdminLayout>
    );
}