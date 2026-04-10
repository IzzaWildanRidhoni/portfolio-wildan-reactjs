// resources/js/Pages/Admin/Dashboard.jsx
import { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    FolderKanban, Wrench, Trophy, GraduationCap,
    Briefcase, Mail, MailOpen, Trash2, Star,
    TrendingUp, Clock, CheckCircle, Circle
} from 'lucide-react';

// ─── Warna palet konsisten ───────────────────────────────────────────────────
const PALETTE = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

// ─── Komponen Stat Card ───────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = '#6366f1', href }) {
    const card = (
        <div className="group relative bg-[#111111] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.14] transition-all duration-200 overflow-hidden">
            {/* Glow accent */}
            <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: color }}
            />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-[11.5px] font-medium text-white/35 uppercase tracking-wide">{label}</p>
                    <p className="text-[28px] font-bold text-white mt-1 leading-none">{value}</p>
                    {sub && <p className="text-[11px] text-white/30 mt-1">{sub}</p>}
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/[0.06]"
                    style={{ backgroundColor: color + '20' }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
            </div>
        </div>
    );
    return href ? <Link href={href}>{card}</Link> : card;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1a1a1a] border border-white/[0.10] rounded-lg px-3 py-2 shadow-xl">
            {label && <p className="text-[11px] text-white/40 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} className="text-[13px] font-semibold" style={{ color: p.color || p.fill || '#fff' }}>
                    {p.name ? `${p.name}: ` : ''}{p.value}
                </p>
            ))}
        </div>
    );
};

// ─── Donut / Pie Chart Card ───────────────────────────────────────────────────
function DonutCard({ title, data, colors = PALETTE }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
        <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5">
            <h3 className="text-[13px] font-semibold text-white/70 mb-4">{title}</h3>
            <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={32} outerRadius={52}
                            dataKey="value" paddingAngle={3} stroke="none">
                            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                <span className="text-[11.5px] text-white/50">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-semibold text-white/80">{item.value}</span>
                                {total > 0 && (
                                    <span className="text-[10px] text-white/25">
                                        {Math.round(item.value / total * 100)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ stats, charts, recent }) {
    const statCards = [
        { icon: FolderKanban, label: 'Total Proyek',       value: stats.projects,     sub: `${stats.projects > 0 ? Math.round((charts.projectsFeatured[0].value / stats.projects) * 100) : 0}% featured`, color: '#6366f1', href: '/admin/projects' },
        { icon: Wrench,       label: 'Keahlian',           value: stats.skills,       sub: 'skill terdaftar',          color: '#22d3ee', href: '/admin/skills'   },
        { icon: Trophy,       label: 'Pencapaian',         value: stats.achievements, sub: 'sertifikat & penghargaan', color: '#f59e0b', href: '/admin/achievements' },
        { icon: GraduationCap,label: 'Pendidikan',         value: stats.educations,   sub: 'riwayat pendidikan',       color: '#10b981', href: '/admin/educations' },
        { icon: Briefcase,    label: 'Pengalaman',         value: stats.experiences,  sub: 'riwayat karir',            color: '#a78bfa', href: '/admin/experiences' },
        { icon: Mail,         label: 'Pesan Masuk',        value: stats.messages,     sub: `${stats.unread} belum dibaca`, color: '#f43f5e', href: '/admin/messages' },
    ];

    // Format data bar chart untuk kategori achievement
    const barData = charts.achievementsByCategory.length
        ? charts.achievementsByCategory
        : [{ label: 'Belum ada', value: 0 }];

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-6">
                {/* ── Header ────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[20px] font-bold text-white">Dashboard</h2>
                        <p className="text-[12.5px] text-white/35 mt-0.5">Ringkasan statistik portofolio kamu</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] text-white/40">Live</span>
                    </div>
                </div>

                {/* ── Stat Cards ─────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                    {statCards.map((card) => <StatCard key={card.label} {...card} />)}
                </div>

                {/* ── Alert unread messages ──────────────────────────────────── */}
                {stats.unread > 0 && (
                    <Link href="/admin/messages"
                        className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-5 py-3 hover:bg-indigo-500/15 transition-colors">
                        <div className="flex items-center gap-3">
                            <MailOpen className="w-4 h-4 text-indigo-400" />
                            <span className="text-[13px] text-indigo-300">
                                Kamu punya <strong>{stats.unread}</strong> pesan yang belum dibaca
                            </span>
                        </div>
                        <span className="text-[11px] text-indigo-400/60">Lihat sekarang →</span>
                    </Link>
                )}

                {/* ── Row 1: Area Chart + Donut ──────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Messages per month */}
                    <div className="lg:col-span-2 bg-[#111111] border border-white/[0.07] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-[13px] font-semibold text-white/70">Pesan Masuk (12 Bulan Terakhir)</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={charts.messagesPerMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="month" tick={{ fill: '#ffffff30', fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#ffffff30', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="count" name="Pesan" stroke="#6366f1" strokeWidth={2}
                                    fill="url(#msgGrad)" dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: '#6366f1' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Message status donut */}
                    <DonutCard
                        title="Status Pesan"
                        data={charts.messageStatus}
                        colors={['#f43f5e', '#10b981']}
                    />
                </div>

                {/* ── Row 2: Bar chart + Donut ──────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Achievements by category */}
                    <div className="lg:col-span-2 bg-[#111111] border border-white/[0.07] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <h3 className="text-[13px] font-semibold text-white/70">Pencapaian per Kategori</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                <XAxis dataKey="label" tick={{ fill: '#ffffff30', fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#ffffff30', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Jumlah" radius={[4, 4, 0, 0]}>
                                    {barData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Achievements by type donut */}
                    <DonutCard
                        title="Pencapaian per Tipe"
                        data={charts.achievementsByType}
                        colors={['#f59e0b', '#6366f1', '#22d3ee', '#10b981']}
                    />
                </div>

                {/* ── Row 3: Projects featured + Recent tables ──────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Projects donut */}
                    <DonutCard
                        title="Proyek: Featured vs Biasa"
                        data={charts.projectsFeatured}
                        colors={['#6366f1', '#ffffff15']}
                    />

                    {/* Recent messages */}
                    <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-rose-400" />
                                <h3 className="text-[13px] font-semibold text-white/70">Pesan Terbaru</h3>
                            </div>
                            <Link href="/admin/messages" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">Semua →</Link>
                        </div>
                        <div className="space-y-3">
                            {recent.messages.length === 0 && (
                                <p className="text-[12px] text-white/20 text-center py-4">Belum ada pesan</p>
                            )}
                            {recent.messages.map((msg) => (
                                <Link key={msg.id} href={`/admin/messages/${msg.id}`}
                                    className="flex items-start gap-2.5 group">
                                    <div className="mt-0.5 shrink-0">
                                        {msg.is_read
                                            ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500/60" />
                                            : <Circle className="w-3.5 h-3.5 text-rose-400" />
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[12px] font-medium text-white/70 truncate group-hover:text-white/90 transition-colors">{msg.name}</p>
                                        <p className="text-[11px] text-white/30 truncate">{msg.subject || '(Tanpa subjek)'}</p>
                                    </div>
                                    <span className="text-[10px] text-white/20 shrink-0 ml-auto">{msg.created_at}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent projects */}
                    <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-indigo-400" />
                                <h3 className="text-[13px] font-semibold text-white/70">Proyek Terbaru</h3>
                            </div>
                            <Link href="/admin/projects" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">Semua →</Link>
                        </div>
                        <div className="space-y-3">
                            {recent.projects.length === 0 && (
                                <p className="text-[12px] text-white/20 text-center py-4">Belum ada proyek</p>
                            )}
                            {recent.projects.map((proj) => (
                                <Link key={proj.id} href={`/admin/projects/${proj.id}/edit`}
                                    className="flex items-center gap-2.5 group">
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: proj.is_featured ? '#6366f1' : '#ffffff20' }} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[12px] font-medium text-white/70 truncate group-hover:text-white/90 transition-colors">{proj.title}</p>
                                        <p className="text-[10px] text-white/25">{proj.created_at}</p>
                                    </div>
                                    {proj.is_featured && (
                                        <Star className="w-3 h-3 text-amber-400/70 shrink-0" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Footer summary ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: Star,   label: 'Proyek Featured', value: charts.projectsFeatured[0].value, color: '#6366f1' },
                        { icon: MailOpen,label: 'Pesan Terbaca',  value: charts.messageStatus[1].value,    color: '#10b981' },
                        { icon: Mail,   label: 'Belum Dibaca',   value: stats.unread,                      color: '#f43f5e' },
                        { icon: Trash2, label: 'Pesan Dihapus',  value: stats.trashed,                     color: '#ffffff30' },
                    ].map((item) => (
                        <div key={item.label} className="bg-[#111111] border border-white/[0.07] rounded-xl px-4 py-3 flex items-center gap-3">
                            <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                            <div>
                                <p className="text-[10.5px] text-white/30">{item.label}</p>
                                <p className="text-[16px] font-bold text-white">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}