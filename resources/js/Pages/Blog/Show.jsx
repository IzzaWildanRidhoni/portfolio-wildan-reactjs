// resources/js/Pages/Blog/Show.jsx

import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronLeft, Calendar, Eye, Tag, Clock, Rss, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { BlogShowSkeleton } from '@/Components/Skeleton';



// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const estimateRead = (html) => {
    if (!html) return 1;
    const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
};

const stripHtml = (html, max = 120) => {
    if (!html) return '';
    const t = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return t.length <= max ? t : t.slice(0, max) + '...';
};

const defaultThumb = (title) =>
    `https://placehold.co/600x340/0f172a/475569?text=${encodeURIComponent(title ?? 'Blog')}&font=roboto&font_size=16`;

// ── Related Card ──────────────────────────────────────────────────────────────
function RelatedCard({ blog }) {
    const [err, setErr] = useState(false);
    const src = blog.thumbnail && !err ? blog.thumbnail : defaultThumb(blog.title);

    return (
        <Link href={`/blog/${blog.slug}`}
            className="group flex gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.045] hover:border-white/[0.12] transition-all">
            <div className="w-[72px] h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.03]">
                <img src={src} alt={blog.title} onError={() => setErr(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <p className="text-[12.5px] font-medium text-white/78 line-clamp-2 leading-snug group-hover:text-yellow-300 transition-colors">
                    {blog.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-white/28">
                    {blog.category && (
                        <span className="px-1.5 py-0.5 rounded text-[10px]"
                            style={{ background: blog.category.color + '20', color: blog.category.color }}>
                            {blog.category.name}
                        </span>
                    )}
                    <span className="flex items-center gap-0.5">
                        <Calendar className="w-3 h-3" />{formatDate(blog.published_at)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BlogShow({ blog, related = [] }) {
    const [isLoading, setIsLoading] = useState(true);
    const contentRef     = useRef(null);
    const hasHighlighted = useRef(false);
    const readTime       = estimateRead(blog?.content);

    // Inject heading IDs for anchor links
    const htmlContent = (() => {
        if (!blog?.content) return '';
        let i = 0;
        return blog.content.replace(/<(h[1-3])([^>]*)>/gi, (match, tag, attrs) => {
            return `<${tag}${attrs} id="heading-${i++}">`;
        });
    })();

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    // Syntax highlighting
    const applySyntax = useCallback(() => {
        const el = contentRef.current;
        if (!el || hasHighlighted.current) return;

        el.querySelectorAll('pre code').forEach(block => {
            if (block.parentElement.classList.contains('terminal-wrapper')) return;
            const pre = block.parentElement;
            if (!pre || pre.tagName !== 'PRE') return;

            pre.classList.add('terminal-wrapper');
            hljs.highlightElement(block);

            const container = document.createElement('div');
            container.className = 'terminal-container';

            const header = document.createElement('div');
            header.className = 'terminal-header';

            const buttons = document.createElement('div');
            buttons.className = 'terminal-buttons';
            buttons.innerHTML = `
                <span class="terminal-btn terminal-btn-close"></span>
                <span class="terminal-btn terminal-btn-minimize"></span>
                <span class="terminal-btn terminal-btn-maximize"></span>
            `;

            const copyBtn = document.createElement('button');
            copyBtn.className = 'terminal-copy-btn';
            copyBtn.type = 'button';
            copyBtn.innerHTML = `
                <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            copyBtn.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                navigator.clipboard.writeText(block.innerText).then(() => {
                    const ci = copyBtn.querySelector('.copy-icon');
                    const ck = copyBtn.querySelector('.check-icon');
                    ci.style.display = 'none'; ck.style.display = 'block';
                    setTimeout(() => { ci.style.display = 'block'; ck.style.display = 'none'; }, 2000);
                });
            });

            header.appendChild(buttons);
            header.appendChild(copyBtn);
            pre.parentNode.insertBefore(container, pre);
            container.appendChild(header);
            container.appendChild(pre);
        });

        hasHighlighted.current = true;
    }, []);

    useEffect(() => {
        if (!isLoading && blog?.content) {
            hasHighlighted.current = false;
            setTimeout(applySyntax, 0);
        }
    }, [isLoading, blog?.content, applySyntax]);

    if (isLoading) {
        return <MainLayout><BlogShowSkeleton /></MainLayout>;
    }

    if (!blog) {
        return <MainLayout><div className="p-6 text-white/50">Artikel tidak ditemukan.</div></MainLayout>;
    }

    return (
        <MainLayout>
            <style>{`
                .blog-content { color: rgba(255,255,255,0.75); font-size: 14.5px; line-height: 1.88; }
                .blog-content p { margin: 0 0 1em; }
                .blog-content p:last-child { margin-bottom: 0; }
                .blog-content h1 { font-size: 1.55em; font-weight: 700; color: rgba(255,255,255,0.92); margin: 1.5em 0 0.55em; padding-bottom: 0.35em; border-bottom: 1px solid rgba(255,255,255,0.06); scroll-margin-top: 80px; }
                .blog-content h2 { font-size: 1.28em; font-weight: 700; color: rgba(255,255,255,0.88); margin: 1.3em 0 0.45em; scroll-margin-top: 80px; }
                .blog-content h3 { font-size: 1.1em; font-weight: 600; color: rgba(255,255,255,0.85); margin: 1.1em 0 0.4em; scroll-margin-top: 80px; }
                .blog-content strong { font-weight: 600; color: rgba(255,255,255,0.9); }
                .blog-content em { font-style: italic; color: rgba(255,255,255,0.65); }
                .blog-content s { color: rgba(255,255,255,0.35); }
                .blog-content a { color: #818cf8; text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
                .blog-content a:hover { color: #a5b4fc; }
                .blog-content ul { list-style: disc; padding-left: 1.6em; margin: 0.85em 0; }
                .blog-content ol { list-style: decimal; padding-left: 1.6em; margin: 0.85em 0; }
                .blog-content li { margin: 0.3em 0; }
                .blog-content li::marker { color: rgba(99,102,241,0.6); }
                .blog-content blockquote { border-left: 3px solid rgba(99,102,241,0.5); padding: 0.5em 0 0.5em 1.25em; margin: 1.2em 0; color: rgba(255,255,255,0.5); font-style: italic; background: rgba(99,102,241,0.04); border-radius: 0 8px 8px 0; }
                .blog-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 1.75em 0; }
                .blog-content img { max-width: 100%; border-radius: 10px; margin: 1em 0; border: 1px solid rgba(255,255,255,0.08); }
                .blog-content table { border-collapse: collapse; margin: 1em 0; width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; font-size: 13.5px; }
                .blog-content td, .blog-content th { border: 1px solid rgba(255,255,255,0.06); padding: 9px 13px; vertical-align: top; }
                .blog-content th { background: rgba(255,255,255,0.04); font-weight: 600; color: rgba(255,255,255,0.7); text-align: left; }
                .blog-content code:not(pre code) { background: rgba(99,102,241,0.12); color: #a5b4fc; padding: 0.15em 0.45em; border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 0.87em; border: 1px solid rgba(99,102,241,0.2); }
                .blog-content .terminal-wrapper { margin: 0 0; }

                .terminal-container { position: relative; background: #1e1e1e; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
                .terminal-header { background: #2d2d2d; padding: 5px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
                .terminal-buttons { display: flex; gap: 8px; }
                .terminal-btn { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
                .terminal-btn-close { background: #ff5f56; border: 1px solid #e0443e; }
                .terminal-btn-minimize { background: #ffbd2e; border: 1px solid #dea123; }
                .terminal-btn-maximize { background: #27c93f; border: 1px solid #1aab29; }
                .terminal-copy-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); padding: 5px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .terminal-copy-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
                .terminal-copy-btn .check-icon { color: #22c55e; }
                .terminal-container pre { background: #1e1e1e; padding: 0 10px; margin: 0; overflow-x: auto; }
                .terminal-container code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.65; color: #d4d4d4; display: block; white-space: pre; }
                .hljs { background: transparent !important; }
                .hljs-keyword { color: #c678dd; } .hljs-string { color: #98c379; } .hljs-comment { color: #5c6370; font-style: italic; }
                .hljs-function { color: #61afef; } .hljs-number { color: #d19a66; } .hljs-title { color: #61afef; }
                .hljs-attr { color: #d19a66; } .hljs-built_in { color: #e5c07b; } .hljs-variable { color: #e06c75; }
                .terminal-container pre::-webkit-scrollbar { height: 6px; }
                .terminal-container pre::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
                .terminal-container pre::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
            `}</style>

            <div className="space-y-6">
                {/* Back */}
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Kembali
                </Link>


                {/* Meta: category + date + read time + views */}
                <div className="flex flex-wrap items-center gap-2.5 text-[12px] text-white/35">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(blog.published_at)}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{blog.category.name}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readTime} menit baca</span>
                    <span className="flex items-center gap-1 sm:ml-auto"><Eye className="w-3.5 h-3.5" />{blog.views ?? 0} views</span>
                </div>

                {/* Title */}
                <h1 className="text-[24px] sm:text-[30px] font-bold text-white leading-tight tracking-tight">
                    {blog.title}
                </h1>

                {/* Excerpt */}
                {blog.excerpt && (
                    <p className="text-[14px] text-white/48 leading-relaxed border-l-2 border-yellow-500/40 pl-4 italic">
                        {blog.excerpt}
                    </p>
                )}

                {/* Thumbnail */}
                {blog.thumbnail && (
                    <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                        <img src={blog.thumbnail} alt={blog.title}
                            className="w-full h-auto object-cover bg-[#0a0a0a]" loading="lazy" />
                    </div>
                )}

                <div className="border-t border-white/[0.07]" />

                {/* Content — full width */}
                {blog.content && (
                    <div ref={contentRef} className="blog-content"
                        dangerouslySetInnerHTML={{ __html: htmlContent }} />
                )}

                {/* Tags */}
                {blog.tags?.length > 0 && (
                    <>
                        <div className="border-t border-white/[0.07]" />
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[12px] text-white/28">Tags:</span>
                            {blog.tags.map(tag => (
                                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                                    className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/48 hover:border-yellow-500/40 hover:text-yellow-300 transition-all">
                                    <Tag className="w-3 h-3" />#{tag}
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* Related Articles */}
                {related.length > 0 && (
                    <>
                        <div className="border-t border-white/[0.07]" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[13px] font-semibold text-white/55 flex items-center gap-2">
                                    <Rss className="w-4 h-4 text-yellow-400" /> Artikel Terkait
                                </p>
                                <Link href="/blog"
                                    className="flex items-center gap-1 text-[12px] text-yellow-400/70 hover:text-yellow-300 transition-colors">
                                    Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {related.map(r => <RelatedCard key={r.id} blog={r} />)}
                            </div>
                        </div>
                    </>
                )}

                {/* Bottom back link */}
                <div className="pt-2 border-t border-white/[0.06]">
                    <Link href="/blog"
                        className="inline-flex items-center gap-1.5 text-[12.5px] text-white/35 hover:text-white/65 transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" /> Kembali ke semua artikel
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}