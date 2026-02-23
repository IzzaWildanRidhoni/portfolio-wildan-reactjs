import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ContactPageSkeleton } from '@/Components/Skeleton';

const socialLinks = [
    {
        id: 'email',
        label: 'Tetap Terhubung',
        desc: 'Hubungi saya melalui email untuk pertanyaan atau kolaborasi.',
        action: 'Pergi ke Gmail',
        href: 'mailto:satriabahari@gmail.com',
        full: true,
        gradient: 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
        icon: (
            <svg viewBox="0 0 24 24" className="w-14 h-14 opacity-30" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
            </svg>
        ),
    },
    {
        id: 'instagram',
        label: 'Ikuti Perjalanan Saya',
        desc: 'Ikuti perjalanan kreatif saya.',
        action: 'Pergi ke Instagram',
        href: 'https://instagram.com',
        full: false,
        gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        icon: (
            <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-30" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
    {
        id: 'linkedin',
        label: 'Mari Terhubung',
        desc: 'Terhubung dengan saya secara profesional.',
        action: 'Pergi ke Linkedin',
        href: 'https://linkedin.com',
        full: false,
        gradient: 'linear-gradient(135deg, #0277bd 0%, #01579b 100%)',
        icon: (
            <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-30" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        id: 'tiktok',
        label: 'Bergabung dalam Keseruan',
        desc: 'Tonton konten yang menarik dan menyenangkan.',
        action: 'Pergi ke Tiktok',
        href: 'https://tiktok.com',
        full: false,
        gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
        iconText: '♪',
    },
    {
        id: 'github',
        label: 'Jelajahi Kode',
        desc: 'Jelajahi karya sumber terbuka saya.',
        action: 'Pergi ke Github',
        href: 'https://github.com',
        full: false,
        gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
        icon: (
            <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-25" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
];

export default function Contact({ profile }) {
    const [loading, setLoading] = useState(true);
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        message: '',
    });

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/kontak', { onSuccess: () => reset() });
    };

    const fullCard = socialLinks.find(s => s.full);
    const gridCards = socialLinks.filter(s => !s.full);

    return (
        <MainLayout>
            <div className="space-y-7">

                {/* Header */}
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Kontak</h1>
                    <p className="text-[13px] text-white/40">Mari saling terhubung.</p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {loading ? (
                    <ContactPageSkeleton />
                ) : (
                    <>
                        <p className="text-[13px] font-medium text-white/60">Temukan saya di media sosial</p>

                        {/* Full-width email card */}
                        <a
                            href={fullCard.href}
                            className="flex items-center justify-between rounded-xl p-5 relative overflow-hidden group hover:opacity-90 transition-opacity"
                            style={{ background: fullCard.gradient }}
                        >
                            <div className="relative z-10">
                                <h3 className="text-[16px] font-bold text-white mb-1">{fullCard.label}</h3>
                                <p className="text-[12.5px] text-white/70 mb-4 max-w-xs">{fullCard.desc}</p>
                                <span className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[12px] font-medium px-4 py-1.5 rounded-full transition-colors">
                                    {fullCard.action}
                                    <span className="text-[10px]">↗</span>
                                </span>
                            </div>
                            <div className="relative z-10 text-white">
                                {fullCard.icon}
                            </div>
                        </a>

                        {/* 2-col grid cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {gridCards.map(card => (
                                <a
                                    key={card.id}
                                    href={card.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl p-4 relative overflow-hidden group hover:opacity-90 transition-opacity block"
                                    style={{ background: card.gradient }}
                                >
                                    {/* Decorative icon */}
                                    <div className="absolute right-3 bottom-3 text-white">
                                        {card.icon || (
                                            <span className="text-5xl opacity-20 font-bold">{card.iconText}</span>
                                        )}
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-[13px] font-bold text-white mb-1 leading-snug">{card.label}</h3>
                                        <p className="text-[11.5px] text-white/60 mb-3 leading-relaxed">{card.desc}</p>
                                        <span className="inline-flex items-center gap-1 bg-white/15 border border-white/15 text-white text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors group-hover:bg-white/25">
                                            {card.action}
                                            <span className="text-[9px]">↗</span>
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/[0.07]" />

                        {/* Contact form */}
                        <div>
                            <p className="text-[13px] font-medium text-white/60 mb-4">Atau kirimkan saya pesan</p>

                            {recentlySuccessful && (
                                <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13px]">
                                    ✓ Pesan berhasil dikirim! Saya akan membalas secepatnya.
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                        {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Message"
                                        rows={4}
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors resize-none"
                                    />
                                    {errors.message && <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-10 bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.1] text-white text-[13px] font-medium rounded-lg transition-colors disabled:opacity-40"
                                >
                                    {processing ? 'Mengirim...' : 'Send Email'}
                                </button>
                            </form>
                        </div>
                    </>
                )}

            </div>
        </MainLayout>
    );
}