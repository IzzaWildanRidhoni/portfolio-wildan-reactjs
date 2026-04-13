import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronLeft, ExternalLink, Github, X, ChevronRight, ChevronLeft as ChevronLeftIcon, Maximize2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { ProjectShowSkeleton } from '@/Components/Skeleton';

export default function ProjectShow({ project, skillsLookup = {} }) {
     const [loading, setLoading] = useState(true);
    const techStack = project?.tech_stack || [];
    const portfolioImages = project?.images || [];
    
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Ref untuk track apakah sudah di-highlight
    const hasHighlighted = useRef(false);
    const contentRef = useRef(null);

    
    const getSkillMeta = (techName) => {
        const skill = skillsLookup[techName];
        return {
            color: skill?.color || '#6366f1',
            icon_url: skill?.icon_url || null,
        };
    };
    

    // ✅ Loading state handling
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    // ✅ FIX: Trigger re-highlight saat loading selesai DAN project tersedia
    useEffect(() => {
        if (!loading && project?.description && contentRef.current) {
            hasHighlighted.current = false; // reset flag
            setTimeout(() => applySyntaxHighlighting(), 0); // defer ke next tick
        }
    }, [loading, project?.description]); // ← tambahkan 'loading' sebagai dependency!


    // Fungsi untuk apply syntax highlighting
    const applySyntaxHighlighting = useCallback(() => {
        const content = contentRef.current;
        if (!content) return;

        // Reset flag jika content berubah
        if (!hasHighlighted.current || content.querySelectorAll('.terminal-wrapper').length === 0) {
            content.querySelectorAll('pre code').forEach((block) => {
                if (block.parentElement.classList.contains('terminal-wrapper')) return;
                
                const pre = block.parentElement;
                if (!pre || pre.tagName !== 'PRE') return;
                
                pre.classList.add('terminal-wrapper');
                hljs.highlightElement(block);
                
                // Create terminal container
                const terminalContainer = document.createElement('div');
                terminalContainer.className = 'terminal-container';
                
                // Create header
                const macHeader = document.createElement('div');
                macHeader.className = 'terminal-header';
                
                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'terminal-buttons';
                buttonsDiv.innerHTML = `
                    <span class="terminal-btn terminal-btn-close"></span>
                    <span class="terminal-btn terminal-btn-minimize"></span>
                    <span class="terminal-btn terminal-btn-maximize"></span>
                `;
                
                // Copy button
                const copyBtn = document.createElement('button');
                copyBtn.className = 'terminal-copy-btn';
                copyBtn.type = 'button';
                copyBtn.title = 'Copy code';
                copyBtn.innerHTML = `
                    <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                copyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const codeText = block.innerText;
                    
                    navigator.clipboard.writeText(codeText).then(() => {
                        const copyIcon = copyBtn.querySelector('.copy-icon');
                        const checkIcon = copyBtn.querySelector('.check-icon');
                        
                        if (copyIcon && checkIcon) {
                            copyIcon.style.display = 'none';
                            checkIcon.style.display = 'block';
                            
                            setTimeout(() => {
                                copyIcon.style.display = 'block';
                                checkIcon.style.display = 'none';
                            }, 2000);
                        }
                    });
                });

                macHeader.appendChild(buttonsDiv);
                macHeader.appendChild(copyBtn);
                
                pre.parentNode.insertBefore(terminalContainer, pre);
                terminalContainer.appendChild(macHeader);
                terminalContainer.appendChild(pre);
            });
            
            hasHighlighted.current = true;
        }
    }, []);

    // Apply highlighting setelah content di-render
    useEffect(() => {
        if (project?.description) {
            // Reset flag saat description berubah
            hasHighlighted.current = false;
            // Apply setelah render selesai
            setTimeout(() => {
                applySyntaxHighlighting();
            }, 0);
        }
    }, [project?.description, applySyntaxHighlighting]);

    // Re-apply highlighting saat lightbox state berubah
    useEffect(() => {
        if (hasHighlighted.current) {
            setTimeout(() => {
                applySyntaxHighlighting();
            }, 0);
        }
    }, [lightboxOpen, applySyntaxHighlighting]);

    const openLightbox = useCallback((index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
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

     if (loading) {
        return (
            <MainLayout>
                <ProjectShowSkeleton />
            </MainLayout>
        );
    }

    // ✅ Fallback jika project null
    if (!project) {
        return <MainLayout><div className="p-6 text-white/60">Project not found</div></MainLayout>;
    }


    return (
        <MainLayout>
            <style>{`
                .project-content { color: rgba(255,255,255,0.72); font-size: 14px; line-height: 1.8; }
                .project-content p { margin: 0 0 0.85em; }
                .project-content p:last-child { margin-bottom: 0; }
                .project-content h1 { font-size: 1.5em; font-weight: 700; color: rgba(255,255,255,0.92); margin: 1.4em 0 0.5em; padding-bottom: 0.3em; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .project-content h2 { font-size: 1.25em; font-weight: 700; color: rgba(255,255,255,0.88); margin: 1.2em 0 0.45em; }
                .project-content h3 { font-size: 1.1em; font-weight: 600; color: rgba(255,255,255,0.85); margin: 1em 0 0.4em; }
                .project-content strong { font-weight: 600; color: rgba(255,255,255,0.9); }
                .project-content em { font-style: italic; color: rgba(255,255,255,0.65); }
                
                .project-content code:not(pre code) { 
                    background: rgba(99,102,241,0.12); 
                    color: #a5b4fc; 
                    padding: 0.15em 0.45em; 
                    border-radius: 5px; 
                    font-family: 'JetBrains Mono', monospace; 
                    font-size: 0.87em; 
                    border: 1px solid rgba(99,102,241,0.2); 
                }
                
                .terminal-wrapper { margin: 1.5em 0; }
                
                .terminal-container {
                    position: relative;
                    background: #1e1e1e;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
                
                .terminal-container:hover {
                    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                }
                
                .terminal-header {
                    background: #2d2d2d;
                    padding: 12px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .terminal-buttons { display: flex; gap: 8px; }
                
                .terminal-btn {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    display: inline-block;
                }
                
                .terminal-btn-close { background: #ff5f56; border: 1px solid #e0443e; }
                .terminal-btn-minimize { background: #ffbd2e; border: 1px solid #dea123; }
                .terminal-btn-maximize { background: #27c93f; border: 1px solid #1aab29; }
                
                .terminal-copy-btn {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: rgba(255,255,255,0.7);
                    padding: 6px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .terminal-copy-btn:hover {
                    background: rgba(255,255,255,0.15);
                    color: #fff;
                    border-color: rgba(99,102,241,0.5);
                }
                
                .terminal-copy-btn .check-icon { color: #22c55e; }
                
                .terminal-container pre {
                    background: #1e1e1e;
                    padding: 20px 24px;
                    margin: 0;
                    overflow-x: auto;
                }
                
                .terminal-container code {
                    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
                    font-size: 13px;
                    line-height: 1.6;
                    color: #d4d4d4;
                    display: block;
                    white-space: pre;
                }
                
                .hljs { background: transparent !important; }
                .hljs-keyword { color: #c678dd; }
                .hljs-string { color: #98c379; }
                .hljs-comment { color: #5c6370; font-style: italic; }
                .hljs-function { color: #61afef; }
                .hljs-number { color: #d19a66; }
                .hljs-title { color: #61afef; }
                .hljs-attr { color: #d19a66; }
                .hljs-built_in { color: #e5c07b; }
                .hljs-class { color: #e5c07b; }
                .hljs-meta { color: #56b6c2; }
                .hljs-variable { color: #e06c75; }
                .hljs-type { color: #e5c07b; }
                .hljs-symbol { color: #56b6c2; }
                
                .terminal-container pre::-webkit-scrollbar { height: 8px; }
                .terminal-container pre::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 4px; }
                .terminal-container pre::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
                
                .project-content blockquote { border-left: 3px solid rgba(99,102,241,0.45); padding: 0.4em 0 0.4em 1.2em; margin: 1em 0; color: rgba(255,255,255,0.45); font-style: italic; background: rgba(99,102,241,0.04); border-radius: 0 8px 8px 0; }
                .project-content ul { list-style: disc; padding-left: 1.5em; margin: 0.75em 0; }
                .project-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.75em 0; }
                .project-content li { margin: 0.25em 0; }
                .project-content a { color: #818cf8; text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
                .project-content a:hover { color: #a5b4fc; }
                .project-content img { max-width: 100%; border-radius: 8px; margin: 0.75em 0; border: 1px solid rgba(255,255,255,0.08); }
                
                .lightbox-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .lightbox-image { max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
                .lightbox-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 12px; border-radius: 50%; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .lightbox-btn:hover { background: rgba(255,255,255,0.2); }
                .lightbox-btn.prev { left: 20px; }
                .lightbox-btn.next { right: 20px; }
                .lightbox-close { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px; border-radius: 50%; cursor: pointer; transition: all 0.2s; }
                .lightbox-counter { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; }
                
                .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
                @media (max-width: 640px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } }
                .gallery-item { aspect-ratio: 1; border-radius: 10px; overflow: hidden; cursor: pointer; position: relative; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s, border-color 0.2s; }
                .gallery-item:hover { transform: scale(1.03); border-color: rgba(99,102,241,0.5); }
                .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
                .gallery-item:hover img { transform: scale(1.05); }
                .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; justify-content: center; padding: 8px; opacity: 0; transition: opacity 0.2s; }
                .gallery-item:hover .gallery-overlay { opacity: 1; }
                .gallery-overlay span { color: white; font-size: 11px; font-weight: 500; background: rgba(99,102,241,0.8); padding: 4px 10px; border-radius: 12px; }
            `}</style>

            <div className="mx-auto space-y-6">
                <Link href="/proyek" className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Kembali
                </Link>

                <div className="text-center">
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
                        {project?.title || 'Untitled Project'}
                    </h1>
                </div>

                <div className="border-t border-white/[0.07]" />

                {techStack.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        <span className="text-[13px] text-white/40 mr-1">Teknologi :</span>
                        {techStack.map((tech, i) => {
                            const { color, icon_url } = getSkillMeta(tech);
                            const key = tech.toLowerCase().replace(/\s/g, '');
                            return (
                                <div key={i} className="flex items-center gap-1.5 border border-white/[0.08] rounded-full px-3 py-1" style={{ backgroundColor: color + '15' }}>
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

                {project?.thumbnail && (
                    <div className="relative group rounded-xl overflow-hidden border border-white/[0.07]">
                        <img src={project.thumbnail} alt={project.title} className="w-full h-auto object-contain bg-[#0a0a0a]" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {(project?.demo_url || project?.repo_url) && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-[#1a1a2e] text-[13px] font-medium px-4 py-2 rounded-lg transition-colors shadow-lg backdrop-blur-sm">
                                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                    </a>
                                )}
                                {project.repo_url && (
                                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/60 hover:bg-black/80 border border-white/20 text-white text-[13px] px-4 py-2 rounded-lg transition-colors backdrop-blur-sm">
                                        <Github className="w-3.5 h-3.5" /> Source
                                    </a>
                                )}
                            </div>
                        )}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 sm:hidden">
                            {project.demo_url && (
                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/90 text-[#1a1a2e] text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg">
                                    <ExternalLink className="w-3 h-3" /> Demo
                                </a>
                            )}
                            {project.repo_url && (
                                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/60 border border-white/20 text-white text-[12px] px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                    <Github className="w-3 h-3" /> Code
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {project?.description && (
                    <>
                        <div className="border-t border-white/[0.07]" />
                        <div ref={contentRef} className="project-content" dangerouslySetInnerHTML={{ __html: project.description }} />
                    </>
                )}

                {portfolioImages.length > 0 && (
                    <>
                        <div className="border-t border-white/[0.07] pt-6">
                            <h3 className="text-[16px] font-semibold text-white text-center mb-4">Portfolio Preview</h3>
                            <div className="gallery-grid">
                                {portfolioImages.map((img, index) => (
                                    <div key={img.id || index} className="gallery-item" onClick={() => openLightbox(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}>
                                        <img src={img.url} alt={img.caption || `Preview ${index + 1}`} loading="lazy" />
                                        <div className="gallery-overlay">
                                            <span><Maximize2 className="w-3 h-3 inline mr-1" />Lihat</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {lightboxOpen && portfolioImages[currentImageIndex] && (
                <div className="lightbox-overlay" onClick={closeLightbox} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
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
                    <img src={portfolioImages[currentImageIndex].url} alt={portfolioImages[currentImageIndex].caption || `Image ${currentImageIndex + 1}`} className="lightbox-image" onClick={(e) => e.stopPropagation()} />
                    {portfolioImages[currentImageIndex].caption && (
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 max-w-md text-center">
                            <p className="text-white/90 text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                                {portfolioImages[currentImageIndex].caption}
                            </p>
                        </div>
                    )}
                    <div className="lightbox-counter">
                        {currentImageIndex + 1} / {portfolioImages.length}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}