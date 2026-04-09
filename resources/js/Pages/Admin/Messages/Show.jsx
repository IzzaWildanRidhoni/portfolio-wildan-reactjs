// resources/js/Pages/Admin/Messages/Show.jsx
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, FlashToast, ConfirmModal, StatusBadge } from '@/Components/Admin/UI';
import { 
    ArrowLeft, Mail, User, Calendar, Globe, Monitor, 
    ExternalLink, Trash2, RefreshCw, MailOpen, Mail as MailIcon,
    Copy, Check
} from 'lucide-react';
import { useState } from 'react';

export default function MessageShow({ message }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    const isRead = !!message.read_at;

    const handleDelete = () => {
        setProcessing(true);
        router.delete(`/admin/messages/${message.id}`, {
            onFinish: () => { setProcessing(false); setConfirmDelete(false); },
            onSuccess: () => router.visit('/admin/messages'),
        });
    };


    const handleCopyEmail = () => {
        navigator.clipboard.writeText(message.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Detail Pesan">
            <FlashToast />
            <div className="max-w-3xl">
                {/* Breadcrumb */}
                <Link href="/admin/messages" className="inline-flex items-center gap-2 text-[12.5px] text-white/40 hover:text-white/70 transition-colors mb-5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke daftar pesan
                </Link>

                {/* Header Card */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 mb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <StatusBadge 
                                    label={isRead ? 'Dibaca' : 'Baru'} 
                                    customClass={isRead 
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                                        : 'bg-amber-500/15 text-amber-400 border-amber-500/20 animate-pulse'
                                    } 
                                />
                                {message.deleted_at && (
                                    <StatusBadge label="Terhapus" customClass="bg-red-500/15 text-red-400 border-red-500/20" />
                                )}
                            </div>
                            <h2 className="text-[18px] font-bold text-white mb-1">
                                {message.subject || '(Tanpa Subjek)'}
                            </h2>
                            <p className="text-[13px] text-white/40">
                                Dikirim pada {formatDate(message.created_at)}
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          
                            {!message.deleted_at ? (
                                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)} disabled={processing}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Hapus
                                </Button>
                            ) : (
                                <>
                                    <Button variant="secondary" size="sm" onClick={() => router.post(`/admin/messages/${message.id}/restore`)} disabled={processing}>
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Pulihkan
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => router.delete(`/admin/messages/${message.id}/force`)} disabled={processing}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Hapus Permanen
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sender Info */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 mb-4">
                    <h3 className="text-[14px] font-semibold text-white/70 uppercase tracking-wider mb-4">Informasi Pengirim</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[11px] text-white/30 uppercase">Nama</p>
                                <p className="text-[14px] text-white font-medium">{message.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] text-white/30 uppercase">Email</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[14px] text-white font-medium truncate">{message.email}</p>
                                    <button 
                                        onClick={handleCopyEmail}
                                        className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
                                        title="Salin email"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[11px] text-white/30 uppercase">Dikirim</p>
                                <p className="text-[14px] text-white font-medium">{formatDate(message.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-[11px] text-white/30 uppercase">IP Address</p>
                                <p className="text-[14px] text-white font-medium font-mono">{message.ip_address}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* User Agent (collapsible) */}
                    <details className="mt-4 group">
                        <summary className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/60 cursor-pointer list-none">
                            <Monitor className="w-3.5 h-3.5" />
                            <span>User Agent</span>
                            <span className="text-[10px] text-white/20 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-2 text-[11px] text-white/30 font-mono break-all bg-white/[0.02] rounded-lg p-3">
                            {message.user_agent}
                        </p>
                    </details>
                </div>

                {/* Message Content */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
                    <h3 className="text-[14px] font-semibold text-white/70 uppercase tracking-wider mb-4">Isi Pesan</h3>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="text-[14px] text-white/80 leading-relaxed whitespace-pre-wrap">
                            {message.message}
                        </p>
                    </div>
                    
                    {/* Reply Button */}
                    <div className="mt-6 pt-4 border-t border-white/[0.06]">
                        <a 
                            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || 'Pesan dari Website')}`}
                            className="inline-flex items-center gap-2 text-[13px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Balas ke {message.email}
                        </a>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            <ConfirmModal 
                open={confirmDelete} 
                onClose={() => setConfirmDelete(false)} 
                onConfirm={handleDelete} 
                loading={processing}
                title="Hapus Pesan?" 
                message="Pesan ini akan dipindahkan ke trash (soft delete) dan dapat dipulihkan nanti." 
            />
        </AdminLayout>
    );
}