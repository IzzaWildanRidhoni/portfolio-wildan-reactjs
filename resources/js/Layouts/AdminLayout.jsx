// resources/js/Layouts/AdminLayout.jsx

import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Award,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    ChevronRight,
    LayoutDashboard,
    Bell,
    User,
    GraduationCap,
    Briefcase
} from 'lucide-react';

const navItems = [
    {
        label:    'Dashboard',
        href:     '/admin',
        icon:     LayoutDashboard,
        exact:    true,
    },
    {
        label:    'Pencapaian',
        href:     '/admin/achievements',
        icon:     Award,
        exact:    false,
    },
    {
        label:    'Pendidikan',
        href:     '/admin/educations',
        icon:     GraduationCap,
        exact:    false,
    },
     {
        label: 'Experience',
        href: '/admin/experiences',
        icon: Briefcase,
        exact: false,
    },
];

function NavLink({ item, collapsed }) {
    const { url } = usePage();
    const active = item.exact
        ? url === item.href
        : url.startsWith(item.href);

    return (
        <Link
            href={item.href}
            className={`group relative flex items-center gap-3 px-3 py-[9px] rounded-[10px] text-[12.5px] transition-all duration-200 overflow-hidden border ${
                active
                    ? 'bg-indigo-500/10 text-white font-medium border-indigo-500/20'
                    : 'text-white/40 border-transparent hover:text-white/80 hover:bg-white/[0.04] hover:border-white/[0.06]'
            }`}
            title={collapsed ? item.label : undefined}
        >
            {/* Active indicator */}
            <span className={`absolute left-0 top-[20%] bottom-[20%] w-[2.5px] rounded-r-full bg-indigo-500 transition-all duration-200 ${active ? 'opacity-100' : 'opacity-0'}`} />

            <item.icon className={`w-[15px] h-[15px] flex-shrink-0 transition-colors ${active ? 'text-indigo-400' : 'text-white/30 group-hover:text-white/60'}`} />

            {!collapsed && (
                <span className="flex-1 whitespace-nowrap">{item.label}</span>
            )}

            {!collapsed && active && (
                <ChevronRight className="w-3 h-3 text-indigo-400/50" />
            )}
        </Link>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Close mobile sidebar on route change
    useEffect(() => {
        const unlisten = router.on('navigate', () => setSidebarOpen(false));
        return unlisten;
    }, []);

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    const SidebarContent = ({ mobile = false }) => (
        <div className={`flex flex-col h-full ${mobile ? '' : ''}`}>
            {/* Logo */}
            <div className={`flex items-center border-b border-white/[0.06] ${collapsed && !mobile ? 'justify-center px-3 py-4' : 'gap-3 px-5 py-4'}`}>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                </div>
                {(!collapsed || mobile) && (
                    <div>
                        <p className="text-[13px] font-bold text-white leading-none">Admin Panel</p>
                        <p className="text-[10px] text-white/30 mt-0.5">Portfolio Manager</p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className={`flex-1 overflow-y-auto py-3 space-y-0.5 ${collapsed && !mobile ? 'px-2' : 'px-3'}`}>
                {(!collapsed || mobile) && (
                    <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest px-3 pb-2 pt-1">
                        Menu
                    </p>
                )}
                {navItems.map(item => (
                    <NavLink key={item.href} item={item} collapsed={collapsed && !mobile} />
                ))}
            </nav>

           {/* User + Profile + Logout */}
            <div className={`border-t border-white/[0.06] ${collapsed && !mobile ? 'px-2 py-3' : 'px-3 py-3'}`}>
                
                {/* User Info - NOW CLICKABLE TO PROFILE */}
                {(!collapsed || mobile) && auth?.admin && (
                    <Link 
                        href="/admin/profile"
                        className="flex items-center gap-2.5 px-3 py-2 mb-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                    >
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/30 transition-colors">
                            <User className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-white/80 truncate group-hover:text-white transition-colors">{auth.admin.name}</p>
                            <p className="text-[10px] text-white/30 truncate">{auth.admin.email}</p>
                        </div>
                    </Link>
                )}

                {/* Profile Link Button (for collapsed state) */}
                {collapsed && !mobile && auth?.admin && (
                    <Link 
                        href="/admin/profile"
                        className="w-full flex items-center justify-center gap-2.5 px-2 py-2 mb-2 rounded-lg text-white/40 hover:text-indigo-400 hover:bg-indigo-500/[0.06] transition-all"
                        title="Profile"
                    >
                        <User className="w-[14px] h-[14px] flex-shrink-0" />
                    </Link>
                )}

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 ${collapsed && !mobile ? 'justify-center' : ''}`}
                    title={collapsed && !mobile ? 'Logout' : undefined}
                >
                    <LogOut className="w-[14px] h-[14px] flex-shrink-0" />
                    {(!collapsed || mobile) && <span>Keluar</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex">
            {/* ── DESKTOP SIDEBAR ── */}
            <aside
                className={`hidden lg:flex flex-col sticky top-0 h-screen bg-[#111111] border-r border-white/[0.06] transition-all duration-300 ${
                    collapsed ? 'w-[60px]' : 'w-[220px]'
                }`}
            >
                <SidebarContent />

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#111111] border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.05] transition-colors z-10"
                >
                    <ChevronRight className={`w-3 h-3 text-white/40 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
                </button>
            </aside>

            {/* ── MOBILE SIDEBAR ── */}
            {sidebarOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="lg:hidden fixed left-0 top-0 h-full w-[240px] bg-[#111111] border-r border-white/[0.06] z-50 animate-in slide-in-from-left duration-300">
                        <SidebarContent mobile />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                        >
                            <X className="w-4 h-4 text-white/50" />
                        </button>
                    </aside>
                </>
            )}

            {/* ── MAIN ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06] px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                        >
                            <Menu className="w-4 h-4 text-white/60" />
                        </button>
                        {title && (
                            <h1 className="text-[15px] font-semibold text-white/90">{title}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <button className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
                            <Bell className="w-4 h-4 text-white/40" />
                        </button>
                        
                        {/* User Profile Link - CLICKABLE, NO PENCIL ICON */}
                        {auth?.admin && (
                            <Link 
                                href="/admin/profile"
                                className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] rounded-lg px-2 py-1 -mx-2 transition-all group"
                            >
                                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                    <User className="w-3.5 h-3.5 text-indigo-400" />
                                </div>
                                <span className="text-[12.5px] text-white/50 group-hover:text-white/70 transition-colors">
                                    {auth.admin.name}
                                </span>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-5 lg:p-7 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}