import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ContactPageSkeleton } from '@/Components/Skeleton';

// 🎨 Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEnvelope, 
    faPaperPlane,
    faArrowUpRightFromSquare  // ✅ Ikon pengganti ↗
} from '@fortawesome/free-solid-svg-icons';
import { 
    faInstagram, 
    faLinkedin, 
    faGithub, 
    faTiktok, 
    faWhatsapp 
} from '@fortawesome/free-brands-svg-icons';

// 🗂️ Mapping icon name ke Font Awesome config
const getFontAwesomeIcon = (iconName, size = '2x') => {
    const iconMap = {
        email: { icon: faEnvelope, style: 'solid' },
        instagram: { icon: faInstagram, style: 'brands' },
        linkedin: { icon: faLinkedin, style: 'brands' },
        github: { icon: faGithub, style: 'brands' },
        tiktok: { icon: faTiktok, style: 'brands' },
        whatsapp: { icon: faWhatsapp, style: 'brands' },
    };
    
    const config = iconMap[iconName] || iconMap.email;
    
    return (
        <FontAwesomeIcon 
            icon={config.icon} 
            className={`opacity-30 text-white fa-${size}`}  // Changed from opacity-30 to opacity-60
        />
    );
};
export default function Contact({ socialLinks = [] }) {
    const [loading, setLoading] = useState(true);
    const { props } = usePage();
    const { success } = props;
    
    const { data, setData, post, processing, errors, reset } = useForm({
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
        post('/kontak', { 
            onSuccess: () => reset(),
            preserveScroll: true 
        });
    };

    const fullCard = socialLinks?.find(s => s.full);
    const gridCards = socialLinks?.filter(s => !s.full) || [];

    return (
        <MainLayout>
            <div className="space-y-6 sm:space-y-7  sm:px-0">

                {/* Header */}
                <div>
                    <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight mb-1">Kontak</h1>
                    <p className="text-[12px] sm:text-[13px] text-white/40">Mari saling terhubung.</p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {loading ? (
                    <ContactPageSkeleton />
                ) : (
                    <>
                        {/* Social Links Section */}
                        {socialLinks?.length > 0 && (
                            <>
                                <p className="text-[12px] sm:text-[13px] font-medium text-white/60">Temukan saya di media sosial</p>

                               {/* Full-width card - Responsive dengan flex-wrap */}
                                {fullCard && (
                                    <a
                                        href={fullCard.href}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:opacity-90 transition-opacity gap-3"
                                        style={{ background: fullCard.gradient }}
                                    >
                                        <div className="relative z-10 flex-1 min-w-0 w-full sm:w-auto">
                                            <h3 className="text-[16px] font-bold text-white mb-1 truncate">
                                                {fullCard.label}
                                            </h3>
                                            <p className="text-[12px] sm:text-[12.5px] text-white/70 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                                                {fullCard.desc}
                                            </p>
                                            <span className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[12px] font-medium px-4 py-1.5 rounded-full transition-colors">
                                                {fullCard.action}
                                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] opacity-70" />
                                            </span>
                                        </div>
                                        <div className="relative z-10 text-white flex-shrink-0 ml-auto sm:ml-0">
                                            {getFontAwesomeIcon(fullCard.icon, '3x')}
                                        </div>
                                    </a>
                                )}

                                 {/* Grid cards - Responsive dengan icon di kanan */}
                                {gridCards.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {gridCards.map(card => (
                                            <a
                                                key={card.id}
                                                href={card.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:opacity-90 transition-opacity"
                                                style={{ background: card.gradient }}
                                            >
                                                <div className="relative z-10 flex-1 min-w-0 pr-3">
                                                    <h3 className="text-[13px] sm:text-[14px] font-bold text-white mb-1 leading-snug">
                                                        {card.label}
                                                    </h3>
                                                    <p className="text-[11px] sm:text-[12px] text-white/70 mb-3 leading-relaxed line-clamp-2">
                                                        {card.desc}
                                                    </p>
                                                    <span className="inline-flex items-center gap-1 bg-white/15 border border-white/15 text-white text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors group-hover:bg-white/25">
                                                        {card.action}
                                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px] opacity-70" />
                                                    </span>
                                                </div>
                                                
                                                {/* Icon di kanan - vertically centered */}
                                                <div className="relative z-10 text-white flex-shrink-0">
                                                    {getFontAwesomeIcon(card.icon, '3x')}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="border-t border-white/[0.07]" />
                            </>
                        )}

                        {/* Contact form - Responsive */}
                        <div>
                            <p className="text-[12px] sm:text-[13px] font-medium text-white/60 mb-3 sm:mb-4">Atau kirimkan saya pesan</p>

                            {success && (
                                <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] sm:text-[13px]">
                                    ✓ {success}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    className="w-full h-10 bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.1] text-white text-[13px] font-medium rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} className="text-[11px]" />
                                            Send Email
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                )}

            </div>
        </MainLayout>
    );
}