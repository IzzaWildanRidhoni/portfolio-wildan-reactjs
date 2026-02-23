import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { DashboardPageSkeleton } from '@/Components/Skeleton';

const umamiStats = [
    { label: 'Dilihat',     value: '46.638', raw: 46638 },
    { label: 'Pengunjung',  value: '6.655',  raw: 6655  },
    { label: 'Kunjungan',   value: '9.981',  raw: 9981  },
    { label: 'Negara',      value: '109',    raw: 109   },
    { label: 'Acara',       value: '4.580',  raw: 4580  },
];

// Sessions vs page views mock data (last 6 months)
const chartData = [
    { label: 'Sep', sessions: 9000,  pageviews: 16200 },
    { label: 'Oct', sessions: 7200,  pageviews: 9400  },
    { label: 'Nov', sessions: 8800,  pageviews: 11600 },
    { label: 'Dec', sessions: 6500,  pageviews: 8700  },
    { label: 'Jan', sessions: 11200, pageviews: 13100 },
    { label: 'Feb', sessions: 5800,  pageviews: 7300  },
    { label: 'Mar', sessions: 7900,  pageviews: 9100  },
    { label: 'Apr', sessions: 10400, pageviews: 12300 },
    { label: 'May', sessions: 6700,  pageviews: 8500  },
];

const wakaStats = [
    { label: 'TypeScript', percent: 34, color: '#3178C6' },
    { label: 'JavaScript', percent: 22, color: '#F7DF1E' },
    { label: 'Go',         percent: 18, color: '#00ADD8' },
    { label: 'Kotlin',     percent: 14, color: '#7F52FF' },
    { label: 'PHP',        percent: 8,  color: '#777BB4' },
    { label: 'Other',      percent: 4,  color: '#444' },
];

function BarChart({ data }) {
    const maxVal = Math.max(...data.flatMap(d => [d.sessions, d.pageviews]));

    return (
        <div className="relative">
            {/* Legend */}
            <div className="flex items-center gap-5 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <span className="text-[11px] text-white/40">Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="text-[11px] text-white/40">Page views</span>
                </div>
            </div>

            {/* Y axis labels */}
            <div className="flex gap-2">
                <div className="flex flex-col justify-between h-44 text-right pr-2 pb-6">
                    {[18000, 14000, 10000, 6000].map(v => (
                        <span key={v} className="text-[10px] text-white/20 font-mono">
                            {v.toLocaleString()}
                        </span>
                    ))}
                </div>

                {/* Bars */}
                <div className="flex-1">
                    {/* Grid lines */}
                    <div className="relative h-44 mb-2">
                        {[0, 25, 50, 75, 100].map(p => (
                            <div
                                key={p}
                                className="absolute left-0 right-0 border-t border-white/[0.04]"
                                style={{ bottom: `${p}%` }}
                            />
                        ))}

                        {/* Bar groups */}
                        <div className="absolute inset-0 flex items-end gap-1.5 px-1">
                            {data.map((d, i) => (
                                <div key={i} className="flex-1 flex items-end gap-0.5 h-full">
                                    {/* Sessions bar */}
                                    <div className="flex-1 flex items-end">
                                        <div
                                            className="w-full bg-white/20 hover:bg-white/30 rounded-t-sm transition-colors cursor-default"
                                            style={{ height: `${(d.sessions / maxVal) * 100}%` }}
                                            title={`Sessions: ${d.sessions.toLocaleString()}`}
                                        />
                                    </div>
                                    {/* Page views bar */}
                                    <div className="flex-1 flex items-end">
                                        <div
                                            className="w-full bg-yellow-400/80 hover:bg-yellow-400 rounded-t-sm transition-colors cursor-default"
                                            style={{ height: `${(d.pageviews / maxVal) * 100}%` }}
                                            title={`Page views: ${d.pageviews.toLocaleString()}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* X labels */}
                    <div className="flex gap-1.5 px-1">
                        {data.map((d, i) => (
                            <div key={i} className="flex-1 text-center text-[10px] text-white/25 font-mono">
                                {d.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ stats }) {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('Semua');

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    return (
        <MainLayout>
            <div className="space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Dasbor</h1>
                    <p className="text-[13px] text-white/40">Dasbor pribadi saya yang dibangun dengan rute API Next.js, memvisualisasikan statistik pengembangan dan kontribusi secara real-time.</p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {loading ? (
                    <DashboardPageSkeleton />
                ) : (
                    <div className="space-y-8">

                        {/* ── UMAMI ── */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[16px]">🐿</span>
                                    <h2 className="text-[16px] font-bold text-white">Umami</h2>
                                </div>
                                <select
                                    value={period}
                                    onChange={e => setPeriod(e.target.value)}
                                    className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 pr-7 text-[12px] text-white/60 focus:outline-none cursor-pointer appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23ffffff40' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                                >
                                    <option>Semua</option>
                                    <option>7 hari</option>
                                    <option>30 hari</option>
                                    <option>3 bulan</option>
                                </select>
                            </div>
                            <p className="text-[12.5px] text-white/35 mb-5">Pantau trafik dan interaksi real-time dari situs portofolio saya.</p>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                                {umamiStats.map(stat => (
                                    <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                        <p className="text-[11.5px] text-white/35 mb-1.5">{stat.label}</p>
                                        <p className="text-[22px] font-bold text-yellow-400 leading-none tracking-tight">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Chart */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                                <BarChart data={chartData} />
                            </div>
                        </div>

                        <div className="border-t border-white/[0.07]" />

                        {/* ── WAKATIME ── */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[16px]">⏱</span>
                                <h2 className="text-[16px] font-bold text-white">WakaTime</h2>
                            </div>
                            <p className="text-[12.5px] text-white/35 mb-5">Statistik coding saya dalam 30 hari terakhir.</p>

                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
                                {wakaStats.map(lang => (
                                    <div key={lang.label} className="space-y-1.5">
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-white/60">{lang.label}</span>
                                            <span className="text-white/35 font-mono">{lang.percent}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </MainLayout>
    );
}