import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ProjectsPageSkeleton } from '@/Components/Skeleton';
import { Star, FolderOpen, ExternalLink } from 'lucide-react';

const staticProjects = [
    {
        id: 1,
        title: 'satriabahari.my.id',
        description: 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind ...',
        thumbnail: null,
        tech_stack: ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'express', 'supabase'],
        is_featured: true,
        demo_url: 'https://satriabahari.my.id',
        repo_url: null,
        bg: '#0f1117',
    },
    {
        id: 2,
        title: 'Presence Internal System',
        description: 'The Presence Internal System is a custom-built attendance tracking backend developed ...',
        thumbnail: null,
        tech_stack: ['go'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#0d1f17',
    },
    {
        id: 3,
        title: 'Berbagi.link',
        description: 'Berbagi.link is a mini-website platform for online businesses but lacks mobile functi...',
        thumbnail: null,
        tech_stack: ['kotlin'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#1a0f1f',
    },
    {
        id: 4,
        title: 'Robust',
        description: 'Robust Fitness is a platform designed to help users achieve their fitness goals effec...',
        thumbnail: null,
        tech_stack: ['php', 'tailwindcss', 'mysql'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#1f0a0a',
    },
    {
        id: 5,
        title: 'Digital Business',
        description: 'Revolutionize your business with our digital solutions, offering innovative services ...',
        thumbnail: null,
        tech_stack: ['typescript', 'tailwindcss', 'react', 'astro'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#0a0f1a',
    },
    {
        id: 6,
        title: 'TechCult',
        description: 'Discover the rich and diverse culture of Indonesia through our site. From mesmerizing...',
        thumbnail: null,
        tech_stack: ['typescript', 'tailwindcss', 'react', 'nextdotjs'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#0a1a0f',
    },
    {
        id: 7,
        title: 'Astronesia',
        description: 'The Astronesia school website, as a final project for a software engineering course, ...',
        thumbnail: null,
        tech_stack: ['javascript', 'tailwindcss', 'react', 'nextdotjs', 'astro', 'mysql'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#001020',
    },
    {
        id: 8,
        title: 'Inventory Smart',
        description: 'Inventory Smart is an advanced inventory management solution designed to streamline s...',
        thumbnail: null,
        tech_stack: ['php', 'tailwindcss', 'mysql'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#0f0f1a',
    },
    {
        id: 9,
        title: 'Portfolio',
        description: 'Personal website & portfolio, built from scratch using Next.js, Typescript, and Tailw...',
        thumbnail: null,
        tech_stack: ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'astro'],
        is_featured: false,
        demo_url: null,
        repo_url: null,
        bg: '#101010',
    },
];

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
    firebase:     '#FFCA28',
    laravel:      '#FF2D20',
    nodedotjs:    '#339933',
};

function TechIcon({ slug }) {
    const color = techColors[slug] || '#ffffff';
    return (
        <div
            className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: color + '20' }}
            title={slug}
        >
            <img
                src={`https://cdn.simpleicons.org/${slug}`}
                alt={slug}
                className="w-[15px] h-[15px] object-contain"
                onError={e => { e.target.style.display = 'none'; }}
            />
        </div>
    );
}

function ProjectThumbnail({ project }) {
    if (project.thumbnail) {
        return (
            <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        );
    }

    // Decorative placeholder matching design reference
    return (
        <div
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: project.bg || '#111' }}
        >
            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />
            {/* Center icon */}
            <div className="flex flex-col items-center gap-2 relative z-10">
                <FolderOpen className="w-10 h-10 text-white/10" />
                <span className="text-[11px] text-white/20 font-medium tracking-wide">{project.title}</span>
            </div>
        </div>
    );
}

export default function Projects({ projects }) {
    const [loading, setLoading] = useState(true);

    const displayProjects = projects?.length ? projects : staticProjects;

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Proyek</h1>
                    <p className="text-[13px] text-white/40">Etalase proyek pribadi maupun sumber terbuka (open-source) yang telah saya bangun atau kontribusikan.</p>
                </div>

                <div className="border-t border-white/[0.07]" />

                {loading ? (
                    <ProjectsPageSkeleton />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayProjects.map(project => (
                            <Link
                                key={project.id}
                                href={`/proyek/${project.id}`}
                                className="group rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 block"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-[175px] overflow-hidden">
                                    <ProjectThumbnail project={project} />

                                    {project.is_featured && (
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-yellow-400 text-black text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg">
                                            <Star className="w-3 h-3" />
                                            Featured
                                        </div>
                                    )}

                                    {project.demo_url && (
                                        <a
                                            href={project.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 text-white" />
                                        </a>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-[13.5px] font-semibold text-white mb-1">{project.title}</h3>
                                    <p className="text-[12.5px] text-white/40 leading-relaxed line-clamp-2">{project.description}</p>

                                    {project.tech_stack && project.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {project.tech_stack.map((tech, i) => (
                                                <TechIcon key={i} slug={tech} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </MainLayout>
    );
}