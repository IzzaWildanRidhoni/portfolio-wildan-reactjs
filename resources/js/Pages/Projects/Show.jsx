import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronLeft, ExternalLink, Github, X, ChevronRight, ChevronLeft as ChevronLeftIcon, Maximize2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

export default function ProjectShow({ project, skillsLookup = {} }) {
    const techStack = project?.tech_stack || [];
    const portfolioImages = project?.images || [];
    
    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Helper untuk dapat color & icon dari lookup
    const getSkillMeta = (techName) => {
        const skill = skillsLookup[techName];
        return {
            color: skill?.color || '#6366f1',
            icon_url: skill?.icon_url || null,
        };
    };

    // === LIGHTBOX LOGIC ===
    const openLightbox = useCallback((index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        document.body.style.overflow = '';
    }, []);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => 
            prev < portfolioImages.length - 1 ? prev + 1 : 0
        );
    }, [portfolioImages.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => 
            prev > 0 ? prev - 1 : portfolioImages.length - 1
        );
    }, [portfolioImages.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!lightboxOpen) return;
        
        const handleKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

    // Touch swipe support
    const touchStart = useRef(null);
    const handleTouchStart = (e) => {
        touchStart.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        if (!touchStart.current) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (diff > 50) nextImage();
        if (diff < -50) prevImage();
        touchStart.current = null;
    };

    if (!project) return <MainLayout><div className="p-6 text-white/60">Project not found</div></MainLayout>;

    return (
        <MainLayout>
            {/* CSS Styles */}
            <style>{`
                .project-content { color: rgba(255,255,255,0.72); font-size: 14px; line-height: 1.8; }
                .project-content p { margin: 0 0 0.85em; }
                .project-content p:last-child { margin-bottom: 0; }
                .project-content h1 { font-size: 1.5em; font-weight: 700; color: rgba(255,255,255,0.92); margin: 1.4em 0 0.5em; padding-bottom: 0.3em; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .project-content h2 { font-size: 1.25em; font-weight: 700; color: rgba(255,255,255,0.88); margin: 1.2em 0 0.45em; }
                .project-content h3 { font-size: 1.1em; font-weight: 600; color: rgba(255,255,255,0.85); margin: 1em 0 0.4em; }
                .project-content strong { font-weight: 600; color: rgba(255,255,255,0.9); }
                .project-content em { font-style: italic; color: rgba(255,255,255,0.65); }
                .project-content code:not(pre code) { background: rgba(99,102,241,0.12); color: #a5b4fc; padding: 0.15em 0.45em; border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 0.87em; border: 1px solid rgba(99,102,241,0.2); }
                .project-content pre { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px 20px; margin: 1.1em 0; overflow-x: auto; }
                .project-content pre code { font-family: 'JetBrains Mono', monospace !important; font-size: 13px !important; background: none !important; padding: 0 !important; border: none !important; color: #e4e4e7; line-height: 1.65; }
                .project-content .hljs-keyword { color: #c792ea; }
                .project-content .hljs-string { color: #c3e88d; }
                .project-content .hljs-comment { color: #546e7a; font-style: italic; }
                .project-content blockquote { border-left: 3px solid rgba(99,102,241,0.45); padding: 0.4em 0 0.4em 1.2em; margin: 1em 0; color: rgba(255,255,255,0.45); font-style: italic; background: rgba(99,102,241,0.04); border-radius: 0 8px 8px 0; }
                .project-content ul { list-style: disc; padding-left: 1.5em; margin: 0.75em 0; }
                .project-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.75em 0; }
                .project-content li { margin: 0.25em 0; }
                .project-content a { color: #818cf8; text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
                .project-content a:hover { color: #a5b4fc; }
                .project-content img { max-width: 100%; border-radius: 8px; margin: 0.75em 0; border: 1px solid rgba(255,255,255,0.08); }
                
                /* Lightbox Styles */
                .lightbox-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.95);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000; animation: fadeIn 0.2s ease;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                .lightbox-image {
                    max-width: 90vw; max-height: 85vh;
                    object-fit: contain; border-radius: 8px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }
                
                .lightbox-btn {
                    position: absolute; top: 50%; transform: translateY(-50%);
                    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                    color: white; padding: 12px; border-radius: 50%;
                    cursor: pointer; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center;
                }
                .lightbox-btn:hover { background: rgba(255,255,255,0.2); }
                .lightbox-btn.prev { left: 20px; }
                .lightbox-btn.next { right: 20px; }
                
                .lightbox-close {
                    position: absolute; top: 20px; right: 20px;
                    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                    color: white; padding: 8px; border-radius: 50%;
                    cursor: pointer; transition: all 0.2s;
                }
                
                .lightbox-counter {
                    position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
                    background: rgba(0,0,0,0.6); color: white;
                    padding: 6px 16px; border-radius: 20px;
                    font-size: 13px; font-weight: 500;
                }
                
                /* Gallery Grid */
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 12px;
                }
                @media (max-width: 640px) {
                    .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
                }
                
                .gallery-item {
                    aspect-ratio: 1;
                    border-radius: 10px;
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: transform 0.2s, border-color 0.2s;
                }
                .gallery-item:hover {
                    transform: scale(1.03);
                    border-color: rgba(99,102,241,0.5);
                }
                .gallery-item img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s;
                }
                .gallery-item:hover img { transform: scale(1.05); }
                
                .gallery-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
                    display: flex; align-items: flex-end; justify-content: center;
                    padding: 8px; opacity: 0; transition: opacity 0.2s;
                }
                .gallery-item:hover .gallery-overlay { opacity: 1; }
                .gallery-overlay span {
                    color: white; font-size: 11px; font-weight: 500;
                    background: rgba(99,102,241,0.8);
                    padding: 4px 10px; border-radius: 12px;
                }
            `}</style>

            <div className="space-y-6  mx-auto ">
                {/* Back Button */}
                <Link
                    href="/proyek"
                    className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                </Link>

                {/* Title */}
                <div>
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
                        {project?.title || 'Untitled Project'}
                    </h1>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Tech Stack */}
                {techStack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] text-white/40 mr-1">Teknologi :</span>
                        {techStack.map((tech, i) => {
                            const { color, icon_url } = getSkillMeta(tech);
                            const key = tech.toLowerCase().replace(/\s/g, '');
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5 border border-white/[0.08] rounded-full px-3 py-1"
                                    style={{ backgroundColor: color + '15' }}
                                >
                                    {icon_url ? (
                                        <img src={icon_url} alt={tech} className="w-3.5 h-3.5" onError={e => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <img src={`https://cdn.simpleicons.org/${key}`} alt={tech} className="w-3.5 h-3.5" onError={e => { e.target.style.display = 'none'; }} />
                                    )}
                                    <span className="text-[12px] text-white/60">{tech}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Action Buttons */}
                {(project?.demo_url || project?.repo_url) && (
                    <div className="flex gap-3 flex-wrap">
                        {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                            </a>
                        )}
                        {project.repo_url && (
                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 text-[13px] px-4 py-2 rounded-lg transition-colors">
                                <Github className="w-3.5 h-3.5" /> Source Code
                            </a>
                        )}
                    </div>
                )}

                {/* Main Thumbnail - Compact */}
                {project?.thumbnail && (
                    <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                        <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                
                {/* Portfolio Gallery - Sneak Peek */}
                {portfolioImages.length > 0 && (
                    <>
                        <div className="border-t border-white/[0.07] pt-6">
                            <h3 className="text-[16px] font-semibold text-white mb-4">Sneak Peek</h3>
                            <div className="gallery-grid">
                                {portfolioImages.map((img, index) => (
                                    <div 
                                        key={img.id || index}
                                        className="gallery-item"
                                        onClick={() => openLightbox(index)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                                    >
                                        <img 
                                            src={img.url} 
                                            alt={img.caption || `Preview ${index + 1}`}
                                            loading="lazy"
                                        />
                                        <div className="gallery-overlay">
                                            <span><Maximize2 className="w-3 h-3 inline mr-1" />Lihat</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Description */}
                {project?.description && (
                    <>
                        <div className="border-t border-white/[0.07]" />
                        <div className="project-content" dangerouslySetInnerHTML={{ __html: project.description }} />
                    </>
                )}

            </div>

            {/* LIGHTBOX MODAL */}
            {lightboxOpen && portfolioImages[currentImageIndex] && (
                <div 
                    className="lightbox-overlay"
                    onClick={closeLightbox}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Close Button */}
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>

                    {/* Navigation Buttons */}
                    {portfolioImages.length > 1 && (
                        <>
                            <button className="lightbox-btn prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous">
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            <button className="lightbox-btn next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <img 
                        src={portfolioImages[currentImageIndex].url}
                        alt={portfolioImages[currentImageIndex].caption || `Image ${currentImageIndex + 1}`}
                        className="lightbox-image"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Caption */}
                    {portfolioImages[currentImageIndex].caption && (
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 max-w-md text-center">
                            <p className="text-white/90 text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                                {portfolioImages[currentImageIndex].caption}
                            </p>
                        </div>
                    )}

                    {/* Counter */}
                    <div className="lightbox-counter">
                        {currentImageIndex + 1} / {portfolioImages.length}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}