import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    User,
    Smartphone,
    Award,
    FolderOpen,
    LayoutDashboard,
    MessageSquare,
    Phone,
    Sun,
    Moon,
    BadgeCheck,
    Menu,
    X,
    MessageCircle,
} from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Tentang', href: '/tentang', icon: User },
    // { label: 'Konten', href: '/konten', icon: Smartphone },
    { label: 'Pencapaian', href: '/pencapaian', icon: Award },
    { label: 'Proyek', href: '/proyek', icon: FolderOpen },
    { label: 'Dasbor', href: '/dasbor', icon: LayoutDashboard },
    // { label: 'Ruang Obrolan', href: '/obrolan', icon: MessageSquare },
    { label: 'Kontak', href: '/kontak', icon: Phone },
];

export default function MainLayout({ children }) {
    const { url } = usePage();
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ID');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0d0d0d] text-white font-sans">

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 flex flex-col
                w-[260px] bg-[#141414] border-r border-white/[0.06]
                transition-transform duration-300
                lg:translate-x-0 lg:static lg:flex
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                {/* Profile */}
                <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-white/[0.06]">
                    {/* Avatar */}
                    <div className="relative mb-3">
                        <div className="w-[84px] h-[84px] rounded-full overflow-hidden bg-[#222] ring-2 ring-white/10">
                            <img
                                src="/images/avatar.jpg"
                                alt="Izza Wildan"
                                className="w-full h-full object-cover"
                                onError={e => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.classList.add('flex','items-center','justify-center');
                                    e.target.parentElement.innerHTML = '<span class="text-2xl font-bold text-white/30">IW</span>';
                                }}
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[14px] font-semibold text-white">Izza Wildan</span>
                        <BadgeCheck className="w-[15px] h-[15px] text-blue-400 fill-blue-400" strokeWidth={0} />
                    </div>
                    <span className="text-[12px] text-white/35 mb-4">@izza.wildan</span>

                    {/* Toggles */}
                    <div className="flex items-center gap-2">
                        {/* Language */}
                        <div className="flex items-center rounded-full border border-white/10 overflow-hidden text-[11px] font-medium">
                            <button
                                onClick={() => setLang('US')}
                                className={`px-2.5 py-[5px] transition-colors ${lang === 'US' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'}`}
                            >
                                US
                            </button>
                            <button
                                onClick={() => setLang('ID')}
                                className={`px-2.5 py-[5px] transition-colors ${lang === 'ID' ? 'bg-yellow-400 text-black' : 'text-white/40 hover:text-white/60'}`}
                            >
                                ID
                            </button>
                        </div>

                        {/* Theme */}
                        <div className="flex items-center rounded-full border border-white/10 overflow-hidden">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-[7px] transition-colors ${theme === 'light' ? 'bg-white/15' : 'hover:bg-white/5'}`}
                            >
                                <Sun className="w-3.5 h-3.5 text-white/60" />
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-[7px] transition-colors ${theme === 'dark' ? 'bg-white/15' : 'hover:bg-white/5'}`}
                            >
                                <Moon className="w-3.5 h-3.5 text-white/60" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = href === '/' ? url === '/' : url.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    group flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] transition-all duration-150
                                    ${active
                                        ? 'bg-white/[0.08] text-white font-medium'
                                        : 'text-white/45 hover:text-white/75 hover:bg-white/[0.04]'
                                    }
                                `}
                            >
                                <Icon className={`w-[15px] h-[15px] flex-shrink-0 ${active ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`} />
                                <span className="flex-1">{label}</span>
                                {active && (
                                    <span className="text-white/30 text-xs">→</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                {/* <div className="px-6 py-4 border-t border-white/[0.06]">
                    <p className="text-[11px] text-white/20 text-center">HAK CIPTA © 2026</p>
                    <p className="text-[11px] text-white/20 text-center leading-relaxed">Izza Wildan. Seluruh hak cipta<br />dilindungi undang-undang.</p>
                </div> */}
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#141414] border-b border-white/[0.06]">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 text-white/60 hover:text-white"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <span className="text-[13px] font-semibold">Izza Wildan</span>
            </div>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 min-h-screen pt-[52px] lg:pt-0">
                <div className="max-w-[780px] mx-auto px-6 lg:px-10 py-9">
                    {children}
                </div>
            </main>

            {/* WhatsApp Float */}
            <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-[#222] transition-colors shadow-lg"
            >
                <MessageCircle className="w-5 h-5 text-white/70" />
            </a>
        </div>
    );
}