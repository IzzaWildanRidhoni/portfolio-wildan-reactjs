import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ProjectsPageSkeleton } from '@/Components/Skeleton';
import { Star, ExternalLink } from 'lucide-react';

// const staticProjects = [
//     {
//         id: 1,
//         title: 'izzawildan.my.id',
//         description: 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind ...',
//         thumbnail: null,
//         tech_stack: ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'express', 'supabase'],
//         is_featured: true,
//         demo_url: 'https://izzawildan.my.id',
//         repo_url: null,
//     },
//     {
//         id: 2,
//         title: 'Presence Internal System',
//         description: 'The Presence Internal System is a custom-built attendance tracking backend developed ...',
//         thumbnail: null,
//         tech_stack: ['go'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
//     {
//         id: 3,
//         title: 'Berbagi.link',
//         description: 'Berbagi.link is a mini-website platform for online businesses but lacks mobile functi...',
//         thumbnail: null,
//         tech_stack: ['kotlin'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
//     {
//         id: 4,
//         title: 'Robust',
//         description: 'Robust Fitness is a platform designed to help users achieve their fitness goals effec...',
//         thumbnail: null,
//         tech_stack: ['php', 'tailwindcss', 'mysql'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
//     {
//         id: 5,
//         title: 'Digital Business',
//         description: 'Revolutionize your business with our digital solutions, offering innovative services ...',
//         thumbnail: null,
//         tech_stack: ['typescript', 'tailwindcss', 'react', 'astro'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
//     {
//         id: 6,
//         title: 'TechCult',
//         description: 'Discover the rich and diverse culture of Indonesia through our site. From mesmerizing...',
//         thumbnail: null,
//         tech_stack: ['typescript', 'tailwindcss', 'react', 'nextdotjs'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
//     {
//         id: 7,
//         title: 'Astronesia',
//         description: 'The Astronesia school website, as a final project for a software engineering course, ...',
//         thumbnail: null,
//         tech_stack: ['javascript', 'tailwindcss', 'react', 'nextdotjs', 'astro', 'mysql'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
//     {
//         id: 8,
//         title: 'Inventory Smart',
//         description: 'Inventory Smart is an advanced inventory management solution designed to streamline s...',
//         thumbnail: null,
//         tech_stack: ['php', 'tailwindcss', 'mysql'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
//     {
//         id: 9,
//         title: 'Portfolio',
//         description: 'Personal website & portfolio, built from scratch using Next.js, Typescript, and Tailw...',
//         thumbnail: null,
//         tech_stack: ['typescript', 'tailwindcss', 'react', 'nextdotjs', 'astro'],
//         is_featured: false,
//         demo_url: null,
//         repo_url: null,
//     },
// ];

const techColors = {
    typescript:  '#3178C6',
    javascript:  '#F7DF1E',
    react:       '#61DAFB',
    nextdotjs:   '#ffffff',
    tailwindcss: '#06B6D4',
    astro:       '#FF5D01',
    go:          '#00ADD8',
    kotlin:      '#7F52FF',
    php:         '#777BB4',
    express:     '#ffffff',
    supabase:    '#3ECF8E',
    mysql:       '#4479A1',
    firebase:    '#FFCA28',
    laravel:     '#FF2D20',
    nodedotjs:   '#339933',
};

// Gambar default dari Unsplash — konsisten per id project
function getDefaultThumbnail(id) {
    const seeds = [
        'coding', 'technology', 'software', 'computer', 'programming',
        'workspace', 'developer', 'digital', 'design', 'startup',
    ];
    const seed = seeds[(id - 1) % seeds.length];
    return `https://source.unsplash.com/600x350/?${seed}&sig=${id}`;
}

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
    const src = project.thumbnail || getDefaultThumbnail(project.id);

    return (
        <img
            src={src}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
                // Fallback kalau Unsplash tidak bisa diakses
                e.target.src = `https://picsum.photos/seed/${project.id}/600/350`;
            }}
        />
    );
}

export default function Projects({ projects }) {
    const [loading, setLoading] = useState(true);

    const displayProjects = projects ;
    // const displayProjects = staticProjects;

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
                    <p className="text-[13px] text-white/40">
                        Etalase proyek pribadi maupun sumber terbuka (open-source) yang telah saya bangun atau kontribusikan.
                    </p>
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
                                <div className="relative h-[175px] overflow-hidden bg-white/[0.03]">
                                    <ProjectThumbnail project={project} />

                                    {/* Overlay gelap tipis supaya badge terbaca */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                                    {project.is_featured && (
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-yellow-400 text-black text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg">
                                            <Star className="w-3 h-3" />
                                            Featured
                                        </div>
                                    )}

                                    {project.demo_url && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Mencegah navigasi ke /proyek/:id
                                                window.open(project.demo_url, '_blank', 'noopener,noreferrer');
                                            }}
                                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            aria-label={`Open demo: ${project.title}`}
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 text-white" />
                                        </button>
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