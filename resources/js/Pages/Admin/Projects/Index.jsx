// resources/js/Pages/Admin/Projects/Index.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Button, FlashToast, ConfirmModal, StatusBadge,
    FilterBar, BulkActionBar, TableCheckbox, ThumbnailCell,
    SortableTh, ActionButtons, ClientPagination,
} from '@/Components/Admin/UI';
import { Plus, ImageOff, Star, ExternalLink, Github, Code2 } from 'lucide-react';

const paginate = (array, page, perPage) =>
    array.slice((page - 1) * perPage, page * perPage);

export default function ProjectsIndex({ projects }) {
    const allData = Array.isArray(projects) ? projects : [];

    const [search, setSearch]           = useState('');
    const [featured, setFeatured]       = useState('');
    const [sortBy, setSortBy]           = useState('order');
    const [sortDir, setSortDir]         = useState('asc');
    const [perPage, setPerPage]         = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected]       = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [bulkConfirm, setBulkConfirm] = useState(false);
    const [deleting, setDeleting]       = useState(false);

    useEffect(() => { setCurrentPage(1); }, [search, featured, sortBy, sortDir, perPage]);

    const processedData = useMemo(() => {
        let result = [...allData];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(q) ||
                p.tech_stack?.some(t => t.toLowerCase().includes(q))
            );
        }
        if (featured === 'true')  result = result.filter(p => p.is_featured);
        if (featured === 'false') result = result.filter(p => !p.is_featured);

        result.sort((a, b) => {
            let valA = a[sortBy] ?? '', valB = b[sortBy] ?? '';
            if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [allData, search, featured, sortBy, sortDir]);

    const paginatedData = paginate(processedData, currentPage, perPage);
    const totalPages    = Math.ceil(processedData.length / perPage);
    const hasActiveFilters = search || featured;

    const handleSort   = (field) => { setSortDir(p => sortBy === field && p === 'asc' ? 'desc' : 'asc'); setSortBy(field); };
    const handleFilter = (key, val) => { if (key === 'featured') setFeatured(val); };
    const handleReset  = () => { setSearch(''); setFeatured(''); setSortBy('order'); setSortDir('asc'); setPerPage(10); setCurrentPage(1); };

    const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
    const toggleAll = () => setSelected(isAllSelected ? [] : paginatedData.map(p => p.id));
    const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/projects/${deleteTarget}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    const handleBulkDelete = () => {
        setDeleting(true);
        router.delete('/admin/projects', {
            data: { ids: selected },
            onFinish: () => { setDeleting(false); setBulkConfirm(false); setSelected([]); },
        });
    };

    return (
        <AdminLayout title="Projects">
            <FlashToast />
            <div className="space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[20px] font-bold text-white">Projects</h2>
                        <p className="text-[12.5px] text-white/35 mt-0.5">Kelola portfolio project</p>
                    </div>
                    <Link href="/admin/projects/create">
                        <Button><Plus className="w-4 h-4" />Tambah Project</Button>
                    </Link>
                </div>

                {/* Filters */}
                <FilterBar
                    search={search} onSearchChange={setSearch}
                    filters={[
                        {
                            key: 'featured', value: featured,
                            options: [{ value: 'true', label: '⭐ Featured' }, { value: 'false', label: 'Biasa' }],
                            placeholder: 'Semua',
                        },
                    ]}
                    onFilterChange={handleFilter} onReset={handleReset}
                    perPage={perPage} onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }}
                    hasActiveFilters={hasActiveFilters}
                    searchPlaceholder="Cari judul, tech stack..."
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
                                    <SortableTh label="Judul"   field="title"       currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableTh label="Tech Stack" field="tech_stack" currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableTh label="Featured" field="is_featured" currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableTh label="Order"   field="order"       currentSort={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <th className="px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase">Links</th>
                                    <th className="px-4 py-3 text-right text-[11px] font-medium text-white/30 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-white/25 text-[13px]">
                                            {hasActiveFilters ? 'Tidak ada data yang cocok dengan filter' : 'Belum ada project'}
                                        </td>
                                    </tr>
                                ) : paginatedData.map((project, idx) => (
                                    <tr
                                        key={project.id}
                                        className={`transition-colors hover:bg-white/[0.02] ${selected.includes(project.id) ? 'bg-indigo-500/[0.04]' : ''}`}
                                    >
                                        <td className="w-12 px-4 py-3.5">
                                            <TableCheckbox checked={selected.includes(project.id)} onChange={() => toggleOne(project.id)} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-white/25 font-mono text-[12px]">
                                                {(currentPage - 1) * perPage + idx + 1}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <ThumbnailCell src={project.thumbnail} alt={project.title} fallbackIcon={ImageOff} />
                                        </td>
                                        <td className="px-4 py-3.5 max-w-[220px]">
                                            <p className="text-white/85 font-medium text-[13px] line-clamp-1">{project.title}</p>
                                            {project.description && (
                                                <p
                                                    className="text-[11px] text-white/25 mt-0.5 line-clamp-1"
                                                    dangerouslySetInnerHTML={{
                                                        __html: project.description.replace(/<[^>]*>/g, ' ').substring(0, 80)
                                                    }}
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {(project.tech_stack || []).slice(0, 4).map(tech => (
                                                    <span key={tech} className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50 border border-white/[0.06]">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {(project.tech_stack || []).length > 4 && (
                                                    <span className="text-[10px] text-white/30">+{project.tech_stack.length - 4}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {project.is_featured
                                                ? <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                : <span className="text-white/20 text-[12px]">—</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-white/40 font-mono text-[12px]">{project.order}</span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                {project.demo_url && (
                                                    <a href={project.demo_url} target="_blank" rel="noreferrer"
                                                       className="text-white/30 hover:text-indigo-400 transition-colors" title="Demo">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                {project.repo_url && (
                                                    <a href={project.repo_url} target="_blank" rel="noreferrer"
                                                       className="text-white/30 hover:text-white/70 transition-colors" title="Repository">
                                                        <Github className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <ActionButtons
                                                editUrl={`/admin/projects/${project.id}/edit`}
                                                onDelete={() => setDeleteTarget(project.id)}
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

            {/* Delete single */}
            <ConfirmModal
                open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete} loading={deleting}
                message="Project ini akan dihapus permanen beserta thumbnail-nya."
            />

            {/* Bulk delete */}
            <ConfirmModal
                open={bulkConfirm} onClose={() => setBulkConfirm(false)}
                onConfirm={handleBulkDelete} loading={deleting}
                title={`Hapus ${selected.length} Project?`}
                message="Semua project yang dipilih akan dihapus permanen."
            />
        </AdminLayout>
    );
}