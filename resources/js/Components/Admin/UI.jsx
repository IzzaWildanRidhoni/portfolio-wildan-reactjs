// ─── imports ─────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    // Navigation icons
    ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    // Status icons
    Check, AlertCircle, CheckCircle2, X,
    // Action icons
    Search, RefreshCw, Trash2, Pencil, MoreVertical,
    // Selection icons
    CheckSquare, Square,
} from 'lucide-react';
// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, loading, type = 'button', onClick, ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
    const variants = {
        primary:   'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.01] active:scale-[0.99]',
        secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-white/80 border border-white/[0.1] hover:border-white/[0.2]',
        danger:    'bg-red-600 hover:bg-red-500 text-white',
        ghost:     'text-white/50 hover:text-white hover:bg-white/[0.05]',
        outline:   'border border-white/[0.12] text-white/70 hover:text-white hover:border-white/25 hover:bg-white/[0.03]',
    };
    const sizes = {
        sm: 'h-8 px-3 text-[12px]',
        md: 'h-9 px-4 text-[13px]',
        lg: 'h-11 px-5 text-[13.5px]',
    };

    return (
        <button type={type} disabled={disabled || loading} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {loading && <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />}
            {children}
        </button>
    );
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className = '', ...props }) {
    return (
        <div className="w-full">
            {label && <label className="block text-[11.5px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
            <div className="relative">
                {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />}
                <input className={`w-full h-10 bg-white/[0.04] border rounded-lg text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all ${Icon ? 'pl-10 pr-4' : 'px-4'} ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'} ${className}`} {...props} />
            </div>
            {error && <p className="flex items-center gap-1 text-[11.5px] text-red-400 mt-1.5"><AlertCircle className="w-3 h-3 flex-shrink-0" />{error}</p>}
        </div>
    );
}

// ─── SearchInput ─────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Cari...', onClear, className = '' }) {
    return (
        <div className={`relative flex-1 min-w-[200px] ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange?.(e.target.value)}
                className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
            />
            {value && onClear && (
                <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}

// ─── FilterSelect ────────────────────────────────────────────────────────────
export function FilterSelect({ value, onChange, options = [], placeholder = 'Semua', className = '' }) {
    return (
        <select
            value={value}
            onChange={e => onChange?.(e.target.value)}
            className={`h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-[13px] text-white/60 focus:outline-none focus:border-white/20 cursor-pointer appearance-none pr-8 ${className}`}
        >
            <option value="" className="bg-[#161616]">{placeholder}</option>
            {options.map(opt => {
                const val = typeof opt === 'object' ? opt.value : opt;
                const lbl = typeof opt === 'object' ? opt.label : opt;
                return <option key={val} value={val} className="bg-[#161616]">{lbl}</option>;
            })}
        </select>
    );
}

// ─── ResetFiltersButton ──────────────────────────────────────────────────────
export function ResetFiltersButton({ onClick, className = '' }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-1.5 h-9 px-3 text-[12.5px] text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.15] rounded-lg transition-all ${className}`}>
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
        </button>
    );
}

// ─── PerPageSelect ───────────────────────────────────────────────────────────
export function PerPageSelect({ value, onChange, options = [10, 25, 50, 100], className = '' }) {
    return (
        <select
            value={value}
            onChange={e => onChange?.(Number(e.target.value))}
            className={`h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 pr-7 text-[12px] text-white/60 focus:outline-none focus:border-white/20 appearance-none cursor-pointer ${className}`}
        >
            {options.map(n => <option key={n} value={n} className="bg-[#161616]">{n} per page</option>)}
        </select>
    );
}

// ─── FilterBar ───────────────────────────────────────────────────────────────
export function FilterBar({ 
    search, onSearchChange, 
    filters = [], 
    onFilterChange,
    onReset,
    perPage, onPerPageChange,
    hasActiveFilters,
    searchPlaceholder = 'Cari...',
    className = ''
}) {
    return (
        <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
            <SearchInput value={search} onChange={onSearchChange} onClear={() => onSearchChange?.('')} placeholder={searchPlaceholder} />
            {filters.map(({ key, value, options, placeholder }) => (
                <FilterSelect key={key} value={value} onChange={val => onFilterChange?.(key, val)} options={options} placeholder={placeholder} />
            ))}
            {hasActiveFilters && <ResetFiltersButton onClick={onReset} />}
            <div className="ml-auto flex items-center gap-2">
                <PerPageSelect value={perPage} onChange={onPerPageChange} />
            </div>
        </div>
    );
}

// ─── BulkActionBar ───────────────────────────────────────────────────────────
export function BulkActionBar({ count, onCancel, onDelete, loading, className = '' }) {
    if (count === 0) return null;
    return (
        <div className={`flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 animate-in fade-in duration-200 ${className}`}>
            <span className="text-[13px] text-indigo-300 font-medium">{count} item dipilih</span>
            <div className="flex items-center gap-2">
                <button onClick={onCancel} className="text-[12px] text-white/40 hover:text-white/70 transition-colors">Batal pilih</button>
                <Button variant="danger" size="sm" onClick={onDelete} loading={loading}>
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus ({count})
                </Button>
            </div>
        </div>
    );
}

// ─── TableCheckbox ───────────────────────────────────────────────────────────
export function TableCheckbox({ checked, onChange, className = '' }) {
    return (
        <button onClick={onChange} className={`text-white/30 hover:text-white/60 transition-colors ${className}`}>
            {checked ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
        </button>
    );
}

// ─── ThumbnailCell ───────────────────────────────────────────────────────────
export function ThumbnailCell({ src, alt, fallbackIcon: FallbackIcon, size = 'md', className = '' }) {
    const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
    return (
        <div className={`${sizes[size]} rounded-lg overflow-hidden bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 ${className}`}>
            {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : <FallbackIcon className="w-4 h-4 text-white/20" />}
        </div>
    );
}

// ─── SortIcon ────────────────────────────────────────────────────────────────
export function SortIcon({ field, current, direction }) {
    if (field !== current) return <ChevronDown className="w-3 h-3 opacity-30 rotate-180" />;
    return direction === 'asc' ? <ChevronUp className="w-3 h-3 text-indigo-400" /> : <ChevronDown className="w-3 h-3 text-indigo-400" />;
}

// ─── SortableTh ──────────────────────────────────────────────────────────────
export function SortableTh({ label, field, currentSort, sortDir, onSort, className = '' }) {
    return (
        <th className={`px-4 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-white/60 transition-colors select-none ${className}`} onClick={() => onSort?.(field)}>
            <div className="flex items-center gap-1.5">
                {label}
                <SortIcon field={field} current={currentSort} direction={sortDir} />
            </div>
        </th>
    );
}

// ─── ActionButtons ───────────────────────────────────────────────────────────
export function ActionButtons({ onEdit, onDelete, editUrl, deleteDisabled, className = '' }) {
    return (
        <div className={`flex items-center justify-end gap-1.5 ${className}`}>
            {onEdit || editUrl ? (
                editUrl ? (
                    <Link href={editUrl}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-white/35 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </Link>
                ) : (
                    <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/35 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                )
            ) : null}
            {onDelete && (
                <button onClick={onDelete} disabled={deleteDisabled} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}

// ─── ClientPagination ────────────────────────────────────────────────────────
export function ClientPagination({ currentPage, totalPages, onPageChange, totalItems, perPage, className = '' }) {
    if (totalPages <= 1) return null;
    
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, totalItems);

    const pageNumbers = useMemo(() => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className={`flex items-center justify-between text-[12px] text-white/40 ${className}`}>
            <span>Menampilkan <span className="text-white/60">{from}–{to}</span> dari <span className="text-white/60">{totalItems}</span></span>
            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange?.(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Prev</button>
                {pageNumbers.map((page, idx) => (
                    page === '...' ? (
                        <span key={`e-${idx}`} className="px-2 py-1.5">...</span>
                    ) : (
                        <button key={page} onClick={() => onPageChange?.(page)} className={`w-8 h-8 rounded-lg transition-colors ${currentPage === page ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'hover:bg-white/[0.04] border border-transparent'}`}>{page}</button>
                    )
                ))}
                <button onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
            </div>
        </div>
    );
}

// ─── ConfirmModal ────────────────────────────────────────────────────────────
export function ConfirmModal({ open, onClose, onConfirm, title = 'Hapus Data?', message = 'Tindakan ini tidak dapat dibatalkan.', loading }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-[380px] bg-[#161616] border border-white/[0.1] rounded-2xl p-6 shadow-2xl shadow-black/60 animate-in zoom-in-95 duration-200">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1.5">{title}</h3>
                <p className="text-[13px] text-white/50 mb-6 leading-relaxed">{message}</p>
                <div className="flex items-center gap-2.5">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Batal</Button>
                    <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>Hapus</Button>
                </div>
            </div>
        </div>
    );
}

// ─── FlashToast ──────────────────────────────────────────────────────────────
export function FlashToast() {
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
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl shadow-black/40 text-[13px] font-medium max-w-[360px] animate-in slide-in-from-top-3 duration-300 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
            {isSuccess ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{msg}</span>
            <button onClick={() => setShow(false)} className="ml-auto opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
        </div>
    );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
const badgeVariants = {
    'Profesional': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'Course': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    'Certificate': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    'Badge': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    'Backend': 'bg-green-500/10 text-green-400 border-green-500/15',
    'Frontend': 'bg-blue-500/10 text-blue-400 border-blue-500/15',
    'Mobile': 'bg-purple-500/10 text-purple-400 border-purple-500/15',
    'DevOps': 'bg-orange-500/10 text-orange-400 border-orange-500/15',
    'Design': 'bg-pink-500/10 text-pink-400 border-pink-500/15',
    'Freelance': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/15',
    'SMA': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    'SMK': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    'D3': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    'S1': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'S2': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    'S3': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    'Professional': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    'Certification': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
};
export function StatusBadge({ label, customClass = '' }) {
    return <span className={`inline-flex items-center text-[10.5px] font-medium px-2 py-0.5 rounded-full border ${badgeVariants[label] || 'bg-white/10 text-white/50 border-white/10'} ${customClass}`}>{label}</span>;
}

// ─── FormField ───────────────────────────────────────────────────────────────
export function FormField({ label, error, required, hint, children, className = '' }) {
    return (
        <div className={className}>
            <div className="flex items-baseline justify-between mb-1.5">
                <label className="block text-[11.5px] text-white/50 font-medium uppercase tracking-wider">
                    {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {hint && <span className="text-[11px] text-white/25">{hint}</span>}
            </div>
            {children}
            {error && <p className="flex items-center gap-1 text-[11.5px] text-red-400 mt-1.5"><AlertCircle className="w-3 h-3 flex-shrink-0" />{error}</p>}
        </div>
    );
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function Select({ label, error, options = [], placeholder = 'Pilih...', className = '', ...props }) {
    const base = `w-full h-10 bg-white/[0.04] border rounded-lg px-4 text-[13.5px] text-white focus:outline-none transition-all appearance-none cursor-pointer ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-indigo-500/50'} ${!props.value ? 'text-white/30' : ''} ${className}`;
    const selectEl = (
        <select className={base} {...props}>
            <option value="" className="bg-[#161616] text-white/50">{placeholder}</option>
            {options.map(opt => {
                const value = typeof opt === 'object' ? opt.value : opt;
                const lbl = typeof opt === 'object' ? opt.label : opt;
                return <option key={value} value={value} className="bg-[#161616] text-white">{lbl}</option>;
            })}
        </select>
    );
    if (!label) return selectEl;
    return (
        <div className="w-full">
            {label && <label className="block text-[11.5px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
            {selectEl}
            {error && <p className="flex items-center gap-1 text-[11.5px] text-red-400 mt-1.5"><AlertCircle className="w-3 h-3 flex-shrink-0" />{error}</p>}
        </div>
    );
}

// ─── TextArea ────────────────────────────────────────────────────────────────
export function TextArea({ label, error, className = '', rows = 4, ...props }) {
    const base = `w-full bg-white/[0.04] border rounded-lg p-4 text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all resize-y ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'} ${className}`;
    const textareaEl = <textarea rows={rows} className={base} {...props} />;
    if (!label) return textareaEl;
    return (
        <div className="w-full">
            {label && <label className="block text-[11.5px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
            {textareaEl}
            {error && <p className="flex items-center gap-1 text-[11.5px] text-red-400 mt-1.5"><AlertCircle className="w-3 h-3 flex-shrink-0" />{error}</p>}
        </div>
    );
}