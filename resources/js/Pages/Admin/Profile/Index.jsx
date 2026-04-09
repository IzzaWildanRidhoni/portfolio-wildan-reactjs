import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, FlashToast, StatusBadge } from '@/Components/Admin/UI';
import { 
    Pencil, User, Mail, MapPin, Briefcase, Link2, 
    Github, Linkedin, Instagram, Video, Phone, 
    ExternalLink, CheckCircle2, Globe, Calendar
} from 'lucide-react';

export default function Index({ profile }) {
    const p = profile || {};
    const hasProfile = !!p?.id || !!p?.name;

    const socialLinks = [
        { key: 'github', label: 'GitHub', icon: Github, url: p.github, color: 'hover:bg-gray-500/20 hover:border-gray-500/30' },
        { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, url: p.linkedin, color: 'hover:bg-blue-500/20 hover:border-blue-500/30' },
        { key: 'instagram', label: 'Instagram', icon: Instagram, url: p.instagram, color: 'hover:bg-pink-500/20 hover:border-pink-500/30' },
        { key: 'tiktok', label: 'TikTok', icon: Video, url: p.tiktok, color: 'hover:bg-gray-500/20 hover:border-gray-500/30' },
    ].filter(link => link.url);

    const contactItems = [
        { label: 'Email', value: p.email, icon: Mail, type: 'email' },
        { label: 'WhatsApp', value: p.whatsapp, icon: Phone, type: 'whatsapp' },
        { label: 'Lokasi', value: p.location, icon: MapPin, type: 'text' },
    ].filter(item => item.value);

    return (
        <AdminLayout title="Profile">
            <FlashToast />
            
            <div className=" mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-[20px] font-bold text-white flex items-center gap-2">
                            Profile
                        </h2>
                        <p className="text-[12.5px] text-white/35 mt-1">Kelola informasi profil publik Anda</p>
                    </div>
                    <Link href="/admin/profile/edit">
                        <Button className="shadow-lg shadow-indigo-500/10">
                            <Pencil className="w-4 h-4" />
                            {hasProfile ? 'Edit Profile' : 'Buat Profile'}
                        </Button>
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    {!hasProfile ? (
                        /* ✨ Enhanced Empty State */
                        <div className="text-center py-20 px-6">
                            <div className="relative mx-auto mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/[0.1] flex items-center justify-center animate-pulse">
                                    <User className="w-10 h-10 text-indigo-400/50" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                    <Pencil className="w-3 h-3 text-indigo-300" />
                                </div>
                            </div>
                            <h3 className="text-[16px] font-semibold text-white mb-2">Profile belum dibuat</h3>
                            <p className="text-[13px] text-white/40 max-w-xs mx-auto mb-8">
                                Tambahkan informasi dasar untuk menampilkan profil publik Anda
                            </p>
                            <Link href="/admin/profile/create">
                                <Button className="shadow-lg shadow-indigo-500/10">
                                    <User className="w-4 h-4" />
                                    Buat Profile Sekarang
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        /* ✨ Enhanced Profile Content */
                        <>
                            {/* Profile Info Section */}
                            <div className="px-6 pb-6 mt-5">
                                {/* Avatar + Name Header */}
                                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-[#111111] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-lg shadow-black/30 ring-2 ring-white/10">
                                            {p.avatar ? (
                                                <img 
                                                    src={p.avatar} 
                                                    alt={p.name} 
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-10 h-10 text-white/30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-indigo-500 border-2 border-[#111111] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Pencil className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    </div>
                                    
                                    
                                    <div className="flex-1 pb-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-[18px] sm:text-[20px] font-bold text-white">{p.name}</h3>
                                            {p.work_type && (
                                                <StatusBadge label={p.work_type} customClass="text-[10px] px-2 py-0.5" />
                                            )}
                                        </div>
                                        <p className="text-[13px] text-indigo-300/80 font-mono">@{p.username}</p>
                                        {p.title && (
                                            <p className="text-[13px] text-white/60 mt-1 flex items-center gap-1.5">
                                                <Briefcase className="w-3.5 h-3.5 text-white/30" />
                                                {p.title}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <hr className='pb-5' />

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    
                                    {/* Left Column: Bio + Contact */}
                                    <div className="lg:col-span-2 space-y-6">
                                        
                                        {/* Bio Card */}
                                        {p.bio && (
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-indigo-400" />
                                                    </div>
                                                    <h4 className="text-[12px] font-semibold text-white/80 uppercase tracking-wide">Tentang Saya</h4>
                                                </div>
                                                <p className="text-[13.5px] text-white/70 leading-relaxed whitespace-pre-wrap">{p.bio}</p>
                                            </div>
                                        )}

                                        {/* Contact Card */}
                                        {contactItems.length > 0 && (
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                                    </div>
                                                    <h4 className="text-[12px] font-semibold text-white/80 uppercase tracking-wide">Kontak</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {contactItems.map(({ label, value, icon: Icon, type }) => (
                                                        <div key={label} className="flex items-start gap-3 group">
                                                            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] transition-colors">
                                                                <Icon className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10.5px] text-white/30 uppercase">{label}</p>
                                                                {type === 'email' ? (
                                                                    <a href={`mailto:${value}`} className="text-[13px] text-indigo-300 hover:text-indigo-200 hover:underline transition-colors break-all">
                                                                        {value}
                                                                    </a>
                                                                ) : type === 'whatsapp' ? (
                                                                    <a href={`https://wa.me/${value.replace(/\D/g, '')}`} target="_blank" rel="noopener" className="text-[13px] text-emerald-300 hover:text-emerald-200 hover:underline transition-colors">
                                                                        {value}
                                                                    </a>
                                                                ) : (
                                                                    <p className="text-[13px] text-white/70">{value}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Location + Social */}
                                    <div className="space-y-6">
                                        
                                        {/* Location Card */}
                                        {p.location && (
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                                                    </div>
                                                    <h4 className="text-[12px] font-semibold text-white/80 uppercase tracking-wide">Lokasi</h4>
                                                </div>
                                                <p className="text-[13.5px] text-white/70 flex items-center gap-2">
                                                    <Globe className="w-3.5 h-3.5 text-white/30" />
                                                    {p.location}
                                                </p>
                                            </div>
                                        )}

                                        {/* Social Links Card */}
                                        {socialLinks.length > 0 && (
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                                                        <Link2 className="w-3.5 h-3.5 text-pink-400" />
                                                    </div>
                                                    <h4 className="text-[12px] font-semibold text-white/80 uppercase tracking-wide">Sosial Media</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {socialLinks.map(({ key, label, icon: Icon, url, color }) => (
                                                        <a 
                                                            key={key}
                                                            href={url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[11.5px] text-white/60 transition-all duration-200 ${color} hover:text-white hover:shadow-lg hover:shadow-black/20`}
                                                        >
                                                            <Icon className="w-3.5 h-3.5" />
                                                            <span className="hidden sm:inline">{label}</span>
                                                            <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Meta Info Card */}
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-7 h-7 rounded-lg bg-gray-500/10 border border-gray-500/20 flex items-center justify-center">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                </div>
                                                <h4 className="text-[12px] font-semibold text-white/80 uppercase tracking-wide">Info</h4>
                                            </div>
                                            <div className="space-y-2 text-[12px]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/30">Member sejak</span>
                                                    <span className="text-white/60 font-mono">
                                                        {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}