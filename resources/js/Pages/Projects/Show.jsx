import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronLeft, ExternalLink, Github } from 'lucide-react';

const techColors = {
    typescript:   '#3178C6',
    javascript:   '#F7DF1E',
    react:        '#61DAFB',
    nextdotjs:    '#ffffff',
    tailwindcss:  '#06B6D4',
    astro:        '#FF5D01',
    go:           '#00ADD8',
    kotlin:       '#7F52FF',
    php:          '#777BB4',
    express:      '#ffffff',
    supabase:     '#3ECF8E',
    mysql:        '#4479A1',
    laravel:      '#FF2D20',
};

export default function ProjectShow({ project }) {
    const techStack = project?.tech_stack || ['typescript', 'tailwindcss', 'react', 'nextdotjs'];

    return (
        <MainLayout>
            <div className="space-y-6">
                <Link
                    href="/proyek"
                    className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                </Link>

                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-2">
                        {project?.title || 'Presence Internal System'}
                    </h1>
                    <p className="text-[13.5px] text-white/55 leading-relaxed">
                        {project?.description || 'The Presence Internal System is a custom-built attendance tracking backend developed for internal use at Parto ID. Built using Golang, this system provides secure and efficient API endpoints to handle employee check-ins, complete with photo verification and timestamp logging.'}
                    </p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {/* Tech stack */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] text-white/40 mr-1">Teknologi :</span>
                    {techStack.map((tech, i) => {
                        const color = techColors[tech] || '#fff';
                        return (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 border border-white/[0.08] rounded-full px-3 py-1"
                                style={{ backgroundColor: color + '15' }}
                            >
                                <img
                                    src={`https://cdn.simpleicons.org/${tech}`}
                                    alt={tech}
                                    className="w-3.5 h-3.5"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                                <span className="text-[12px] text-white/60">{tech}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    {project?.demo_url && (
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
                    {project?.repo_url && (
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

                {/* Thumbnail / preview */}
                {project?.thumbnail ? (
                    <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                        <img src={project.thumbnail} alt={project.title} className="w-full" />
                    </div>
                ) : (
                    <div className="rounded-xl overflow-hidden border border-white/[0.07] h-[360px] bg-gradient-to-br from-[#0d1f17] to-[#050f0a] flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                                <img
                                    src="https://cdn.simpleicons.org/go"
                                    alt="Go"
                                    className="w-8 h-8"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <p className="text-[13px] text-white/25">{project?.title || 'Project Preview'}</p>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}