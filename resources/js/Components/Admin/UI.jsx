// resources/js/Components/Admin/UI.jsx

import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown, Check, AlertCircle, CheckCircle2,
    X, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ─── Button ──────────────────────────────────────────────────────────────────

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, loading, type = 'button', onClick }) {
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
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading && (
                <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />
            )}
            {children}
        </button>
    );
}

// ─── Input ───────────────────────────────────────────────────────────────────

export function Input({ label, error, icon: Icon, className = '', ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[11.5px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                )}
                <input
                    className={`w-full h-10 bg-white/[0.04] border rounded-lg text-[13.5px] text-white placeholder-white/20 focus:outline-none transition-all ${
                        Icon ? 'pl-10 pr-4' : 'px-4'
                    } ${
                        error
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/[0.08] focus:border-indigo-500/50 focus:bg-indigo-500/[0.03]'
                    } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="flex items-center gap-1 text-[11.5px] text-red-400 mt-1.5">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

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

// ─── Status Badge ─────────────────────────────────────────────────────────────

const badgeVariants = {
    'Profesional': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'Course':      'bg-blue-500/15 text-blue-400 border-blue-500/20',
    'Certificate': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    'Badge':       'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    'Backend':     'bg-green-500/10 text-green-400 border-green-500/15',
    'Frontend':    'bg-blue-500/10 text-blue-400 border-blue-500/15',
    'Mobile':      'bg-purple-500/10 text-purple-400 border-purple-500/15',
    'DevOps':      'bg-orange-500/10 text-orange-400 border-orange-500/15',
    'Design':      'bg-pink-500/10 text-pink-400 border-pink-500/15',
    'Freelance':   'bg-yellow-500/10 text-yellow-400 border-yellow-500/15',
};

export function StatusBadge({ label }) {
    return (
        <span className={`inline-flex items-center text-[10.5px] font-medium px-2 py-0.5 rounded-full border ${badgeVariants[label] || 'bg-white/10 text-white/50 border-white/10'}`}>
            {label}
        </span>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
// Menerima struktur paginator Laravel langsung (flat object dari ->paginate())

export function Pagination({ paginatorData }) {
    if (!paginatorData || paginatorData.last_page <= 1) return null;

    const { from, to, total, links = [] } = paginatorData;

    // links dari Laravel: [{url, label, active}, ...]
    // Label «Previous» dan «Next» bisa berupa HTML entity &laquo; / &raquo;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-[12px] text-white/30">
                Menampilkan{' '}
                <span className="text-white/60">{from ?? 0}–{to ?? 0}</span>
                {' '}dari{' '}
                <span className="text-white/60">{total ?? 0}</span> data
            </p>

            <div className="flex items-center gap-1">
                {/* Prev */}
                {prevLink && (
                    prevLink.url ? (
                        <Link
                            href={prevLink.url}
                            preserveState
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.1] text-white/50 hover:text-white hover:border-white/25 transition-all"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.05] text-white/20 cursor-not-allowed">
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </span>
                    )
                )}

                {/* Page numbers */}
                {pageLinks.map((link, i) => (
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            preserveState
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-[12px] transition-all ${
                                link.active
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'border-white/[0.08] text-white/40 hover:text-white hover:border-white/20'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            key={i}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.05] text-white/20 text-[12px] cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}

                {/* Next */}
                {nextLink && (
                    nextLink.url ? (
                        <Link
                            href={nextLink.url}
                            preserveState
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.1] text-white/50 hover:text-white hover:border-white/25 transition-all"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.05] text-white/20 cursor-not-allowed">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                    )
                )}
            </div>
        </div>
    );
}


