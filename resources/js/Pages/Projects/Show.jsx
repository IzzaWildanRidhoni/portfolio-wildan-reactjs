import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronLeft, ExternalLink, Github } from 'lucide-react';


export default function ProjectShow({ project, skillsLookup = {} })  {
    const techStack = project?.tech_stack || [];

       // Helper untuk dapat color & icon dari lookup
    const getSkillMeta = (techName) => {
        const skill = skillsLookup[techName];
        return {
            color: skill?.color || '#6366f1', // fallback color
            icon_url: skill?.icon_url || null,
        };
    };


    return (
        <MainLayout>
            {/* TipTap prose styles */}
            <style>{`
                .project-content { color: rgba(255,255,255,0.72); font-size: 14px; line-height: 1.8; }
                .project-content p { margin: 0 0 0.85em; }
                .project-content p:last-child { margin-bottom: 0; }

                .project-content h1 { font-size: 1.5em; font-weight: 700; color: rgba(255,255,255,0.92); margin: 1.4em 0 0.5em; padding-bottom: 0.3em; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .project-content h2 { font-size: 1.25em; font-weight: 700; color: rgba(255,255,255,0.88); margin: 1.2em 0 0.45em; }
                .project-content h3 { font-size: 1.1em; font-weight: 600; color: rgba(255,255,255,0.85); margin: 1em 0 0.4em; }

                .project-content strong { font-weight: 600; color: rgba(255,255,255,0.9); }
                .project-content em { font-style: italic; color: rgba(255,255,255,0.65); }
                .project-content s { color: rgba(255,255,255,0.35); }

                .project-content code:not(pre code) {
                    background: rgba(99,102,241,0.12);
                    color: #a5b4fc;
                    padding: 0.15em 0.45em;
                    border-radius: 5px;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 0.87em;
                    border: 1px solid rgba(99,102,241,0.2);
                }

                .project-content pre {
                    background: #0a0a0a;
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 10px;
                    padding: 16px 20px;
                    margin: 1.1em 0;
                    overflow-x: auto;
                }
                .project-content pre code {
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 13px !important;
                    background: none !important;
                    padding: 0 !important;
                    border: none !important;
                    color: #e4e4e7;
                    line-height: 1.65;
                }

                /* Highlight.js */
                .project-content .hljs-keyword   { color: #c792ea; }
                .project-content .hljs-string     { color: #c3e88d; }
                .project-content .hljs-comment    { color: #546e7a; font-style: italic; }
                .project-content .hljs-number     { color: #f78c6c; }
                .project-content .hljs-function,
                .project-content .hljs-title      { color: #82aaff; }
                .project-content .hljs-variable   { color: #f07178; }
                .project-content .hljs-attr       { color: #ffcb6b; }
                .project-content .hljs-built_in   { color: #80cbc4; }
                .project-content .hljs-operator,
                .project-content .hljs-punctuation { color: #89ddff; }
                .project-content .hljs-tag        { color: #f07178; }
                .project-content .hljs-name       { color: #ff5572; }
                .project-content .hljs-literal    { color: #ff5572; }

                .project-content blockquote {
                    border-left: 3px solid rgba(99,102,241,0.45);
                    padding: 0.4em 0 0.4em 1.2em;
                    margin: 1em 0;
                    color: rgba(255,255,255,0.45);
                    font-style: italic;
                    background: rgba(99,102,241,0.04);
                    border-radius: 0 8px 8px 0;
                }

                .project-content ul { list-style: disc; padding-left: 1.5em; margin: 0.75em 0; }
                .project-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.75em 0; }
                .project-content li { margin: 0.25em 0; }
                .project-content li::marker { color: rgba(99,102,241,0.6); }

                .project-content hr {
                    border: none;
                    border-top: 1px solid rgba(255,255,255,0.07);
                    margin: 1.5em 0;
                }

                .project-content a {
                    color: #818cf8;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                    transition: color 0.15s;
                }
                .project-content a:hover { color: #a5b4fc; }

                .project-content img {
                    max-width: 100%;
                    border-radius: 8px;
                    margin: 0.75em 0;
                    border: 1px solid rgba(255,255,255,0.08);
                }

                .project-content table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1em 0;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    overflow: hidden;
                    font-size: 13px;
                }
                .project-content td, .project-content th {
                    border: 1px solid rgba(255,255,255,0.06);
                    padding: 8px 12px;
                    vertical-align: top;
                }
                .project-content th {
                    background: rgba(255,255,255,0.04);
                    font-weight: 600;
                    color: rgba(255,255,255,0.7);
                    text-align: left;
                }
            `}</style>

            <div className="space-y-6">
                <Link
                    href="/proyek"
                    className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                </Link>

                {/* Title */}
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight">
                        {project?.title || 'Untitled Project'}
                    </h1>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Tech stack - dinamis dari database */}
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
                                    {/* Prioritaskan icon dari database, fallback ke simpleicons */}
                                    {icon_url ? (
                                        <img src={icon_url} alt={tech} className="w-3.5 h-3.5" onError={e => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <img
                                            src={`https://cdn.simpleicons.org/${key}`}
                                            alt={tech}
                                            className="w-3.5 h-3.5"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    )}
                                    <span className="text-[12px] text-white/60">{tech}</span>
                                </div>
                            );
                        })}
                    </div>
                )}


                {/* Action buttons */}
                {(project?.demo_url || project?.repo_url) && (
                    <div className="flex gap-3">
                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Live Demo
                            </a>
                        )}
                        {project.repo_url && (
                            <a
                                href={project.repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 text-[13px] px-4 py-2 rounded-lg transition-colors"
                            >
                                <Github className="w-3.5 h-3.5" />
                                Source Code
                            </a>
                        )}
                    </div>
                )}

                {/* Thumbnail */}
                {project?.thumbnail ? (
                    <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                        <img src={project.thumbnail} alt={project.title} className="w-full" />
                    </div>
                ) : (
                    <div className="rounded-xl overflow-hidden border border-white/[0.07] h-[240px] bg-gradient-to-br from-[#0d1020] to-[#05060f] flex items-center justify-center">
                        <p className="text-[13px] text-white/20">{project?.title || 'Project Preview'}</p>
                    </div>
                )}

                {/* Description — render HTML dari TipTap */}
                {project?.description && (
                    <>
                        <div className="border-t border-white/[0.07]" />
                        <div
                            className="project-content"
                            dangerouslySetInnerHTML={{ __html: project.description }}
                        />
                    </>
                )}
            </div>
        </MainLayout>
    );
}