import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    User,
    Award,
    FolderOpen,
    LayoutDashboard,
    Phone,
    Sun,
    Moon,
    BadgeCheck,
    MessageCircle,
    MoreHorizontal,
} from 'lucide-react';

const navItems = [
    { label: 'Beranda',    href: '/',           icon: Home },
    { label: 'Tentang',    href: '/tentang',    icon: User },
    { label: 'Pencapaian', href: '/pencapaian', icon: Award },
    { label: 'Proyek',     href: '/proyek',     icon: FolderOpen },
    { label: 'Statistik',  href: '/statistik',  icon: LayoutDashboard },
    { label: 'Kontak',     href: '/kontak',     icon: Phone },
];

const bottomNavPrimary = navItems.slice(0, 4);
const bottomNavSecondary = navItems.slice(4);

export default function MainLayout({ children }) {
    const { url } = usePage();
    const [theme, setTheme]       = useState('dark');
    const [lang, setLang]         = useState('ID');
    const [moreOpen, setMoreOpen] = useState(false);

    const isActive = (href) =>
        href === '/' ? url === '/' : url.startsWith(href);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">

            {/* ── SIDEBAR (desktop only) ── */}
            <aside className="hidden lg:flex flex-col w-[255px] bg-card border-r border-border">

                {/* Profile */}
                <div className="flex flex-col items-center pt-7 pb-5 px-5 border-b border-border">

                    {/* Avatar */}
                    <div className="relative mb-3">
                        <div className="p-[2px] rounded-full bg-gradient-to-br from-primary to-primary/60">
                            <div className="w-[76px] h-[76px] rounded-full overflow-hidden bg-card">
                                <img
                                    src="/images/avatar.jpg"
                                    alt="Izza Wildan"
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.classList.add('flex','items-center','justify-center');
                                        e.target.parentElement.innerHTML =
                                            '<span class="text-xl font-semibold text-muted-foreground">IW</span>';
                                    }}
                                />
                            </div>
                        </div>
                        <span className="absolute bottom-[3px] right-[3px] w-3 h-3 rounded-full bg-green-400 border-2 border-card" />
                    </div>

                    {/* Name */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[13.5px] font-semibold text-foreground tracking-[-0.01em]">
                            Izza Wildan
                        </span>
                        <BadgeCheck className="w-[14px] h-[14px] text-primary fill-primary" strokeWidth={0} />
                    </div>
                    <span className="text-[11px] text-muted-foreground mb-4 tracking-wide">
                        @izza.wildan
                    </span>

                    {/* Toggles */}
                    <div className="flex items-center gap-2">
                        {/* Language */}
                        <div className="flex items-center rounded-full border border-border overflow-hidden text-[10.5px] font-medium bg-muted/30">
                            <button
                                onClick={() => setLang('US')}
                                className={`px-2.5 py-[5px] transition-all duration-200 ${
                                    lang === 'US'
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                US
                            </button>
                            <button
                                onClick={() => setLang('ID')}
                                className={`px-2.5 py-[5px] transition-all duration-200 ${
                                    lang === 'ID'
                                        ? 'bg-primary text-primary-foreground font-semibold'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                ID
                            </button>
                        </div>

                        {/* Theme */}
                        <div className="flex items-center rounded-full border border-border overflow-hidden bg-muted/30">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-[7px] transition-all duration-200 ${
                                    theme === 'light' ? 'bg-secondary' : 'hover:bg-secondary/50'
                                }`}
                            >
                                <Sun className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-[7px] transition-all duration-200 ${
                                    theme === 'dark' ? 'bg-secondary' : 'hover:bg-secondary/50'
                                }`}
                            >
                                <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`
                                    group relative flex items-center gap-3 px-3 py-[9px] rounded-[10px]
                                    text-[12.5px] transition-all duration-200 overflow-hidden border
                                    ${active
                                        ? 'bg-primary/10 text-foreground font-medium border-primary/20'
                                        : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/50 hover:border-border hover:translate-x-0.5'
                                    }
                                `}
                            >
                                {/* Active accent bar */}
                                <span className={`
                                    absolute left-0 top-[20%] bottom-[20%] w-[2.5px] rounded-r-full
                                    bg-primary transition-all duration-200
                                    ${active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'}
                                `} />

                                <Icon className={`
                                    w-[15px] h-[15px] flex-shrink-0 transition-all duration-200
                                    ${active
                                        ? 'text-primary'
                                        : 'text-muted-foreground group-hover:text-foreground group-hover:scale-110'
                                    }
                                `} />

                                <span className="flex-1">{label}</span>

                                <span className={`
                                    text-[10px] text-muted-foreground transition-all duration-200
                                    ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}
                                `}>
                                    →
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-border">
                    <p className="text-[10px] text-muted-foreground/50 text-center">
                        © 2026 Izza Wildan
                    </p>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 min-h-screen pb-[72px] lg:pb-0">
                <div className="max-w-[780px] mx-auto px-5 lg:px-10 py-8">
                    {children}
                </div>
            </main>

            {/* ── BOTTOM NAVIGATION (mobile only) ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">

                {/* "Lainnya" drawer */}
                {moreOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            style={{ zIndex: -1 }}
                            onClick={() => setMoreOpen(false)}
                        />
                        {/* Drawer panel */}
                        <div className="absolute bottom-full left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border rounded-t-2xl p-3 grid grid-cols-2 gap-1">
                            {bottomNavSecondary.map(({ label, href, icon: Icon }) => {
                                const active = isActive(href);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setMoreOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3 py-3 rounded-xl text-[12.5px]
                                            transition-all duration-200
                                            ${active
                                                ? 'bg-primary/10 text-foreground font-medium'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Bottom bar */}
                <nav className="flex items-center justify-around bg-card/95 backdrop-blur-md border-t border-border pt-2 pb-[max(env(safe-area-inset-bottom),8px)]">
                    {bottomNavPrimary.map(({ label, href, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="flex flex-col items-center gap-1"
                            >
                                <div className={`
                                    relative p-2 rounded-xl transition-all duration-200
                                    ${active ? 'bg-primary/15' : 'hover:bg-secondary/50'}
                                `}>
                                    <Icon className={`
                                        w-[18px] h-[18px] transition-all duration-200
                                        ${active ? 'text-primary scale-110' : 'text-muted-foreground'}
                                    `} />
                                    {active && (
                                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                    )}
                                </div>
                                <span className={`text-[9.5px] transition-all duration-200 leading-none ${
                                    active ? 'text-primary font-medium' : 'text-muted-foreground'
                                }`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More button */}
                    <button
                        onClick={() => setMoreOpen(!moreOpen)}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className={`
                            p-2 rounded-xl transition-all duration-200
                            ${moreOpen ? 'bg-secondary' : 'hover:bg-secondary/50'}
                        `}>
                            <MoreHorizontal className={`
                                w-[18px] h-[18px] transition-all duration-200
                                ${moreOpen ? 'text-foreground' : 'text-muted-foreground'}
                            `} />
                        </div>
                        <span className="text-[9.5px] text-muted-foreground leading-none">Lainnya</span>
                    </button>
                </nav>
            </div>

            {/* WhatsApp Float (desktop only) */}
            <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="
                    hidden lg:flex
                    fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full
                    bg-card border border-border
                    items-center justify-center
                    hover:bg-secondary hover:border-border/80 hover:scale-105
                    active:scale-95
                    transition-all duration-200
                "
            >
                <MessageCircle className="w-[18px] h-[18px] text-muted-foreground" />
            </a>
        </div>
    );
}