import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ProjectsPageSkeleton } from '@/Components/Skeleton';
import { Star, ExternalLink, GitBranch, Gitlab, Github, FolderGit2 } from 'lucide-react';

// ── Constants ──
const GITHUB_USERNAME = 'IzzaWildanRidhoni';
const GITLAB_USERNAME = 'IzzaWildanRidhoni';
const REPOS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 300;

// ── Tech Colors ──
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
    python:      '#3776AB',
    rust:        '#DEA584',
    java:        '#007396',
    docker:      '#2496ED',
    postgresql:  '#336791',
};

// ── Helper Functions ──
const getLanguageColor = (lang, platform = 'github') => {
    const colors = {
        'JavaScript': 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
        'TypeScript': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
        'PHP': 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30',
        'Python': 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
        'Go': 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
        'Kotlin': 'bg-purple-400/20 text-purple-300 border-purple-400/30',
        'Java': 'bg-orange-400/20 text-orange-300 border-orange-400/30',
        'Rust': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
        'HTML': 'bg-orange-400/20 text-orange-300 border-orange-400/30',
        'CSS': 'bg-pink-400/20 text-pink-300 border-pink-400/30',
        'Vue': 'bg-green-400/20 text-green-300 border-green-400/30',
        'React': 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    };
    return colors[lang] || 'bg-white/10 text-white/60 border-white/20';
};

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num?.toString() || '0';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
};

const getDefaultThumbnail = (text) => {
    const bgColor = '0f172a';
    const textColor = '64748b';
    return `https://placehold.co/600x350/${bgColor}/${textColor}?text=${encodeURIComponent(text)}&font=roboto&font_size=20`;
};

// ── Custom Hooks ──
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

function useGitHubRepos(username) {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRepos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            let allRepos = [];
            let page = 1;
            const perPage = 100;
            
            while (true) {
                const res = await fetch(
                    `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`
                );
                if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
                const data = await res.json();
                if (data.length === 0) break;
                allRepos = [...allRepos, ...data];
                const linkHeader = res.headers.get('Link');
                if (!linkHeader || !linkHeader.includes('rel="next"')) break;
                page++;
                if (page > 10) break;
            }
            allRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setRepos(allRepos);
        } catch (err) {
            console.error('Failed to fetch GitHub repos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => { fetchRepos(); }, [fetchRepos]);
    return { repos, loading, error, refetch: fetchRepos };
}

function useGitLabRepos(username) {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRepos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // GitLab API v4
            const res = await fetch(
                `https://gitlab.com/api/v4/users?username=${username}`
            );
            if (!res.ok) throw new Error(`GitLab API error: ${res.status}`);
            const users = await res.json();
            if (users.length === 0) throw new Error('User not found');
            
            const userId = users[0].id;
            
            // Fetch projects
            const projectsRes = await fetch(
                `https://gitlab.com/api/v4/users/${userId}/projects?order_by=updated_at&sort=desc&per_page=100`
            );
            if (!projectsRes.ok) throw new Error(`GitLab projects error: ${projectsRes.status}`);
            const projects = await projectsRes.json();
            
            setRepos(projects);
        } catch (err) {
            console.error('Failed to fetch GitLab repos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => { fetchRepos(); }, [fetchRepos]);
    return { repos, loading, error, refetch: fetchRepos };
}

// ── Components ──

// Tech Icon Component
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

// Search Input Component
function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-9 pl-9 pr-10 bg-white/[0.04] border border-white/[0.08] rounded-lg 
                           text-[12px] text-white/70 placeholder-white/30 focus:outline-none 
                           focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 
                           transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// Filter Toggle
function FilterToggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-yellow-400/30' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-yellow-400 m-0.5 transition-transform ${checked ? 'translate-x-4' : ''}`} />
            </div>
            <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">{label}</span>
        </label>
    );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[11px] text-white/40 
                           hover:text-white/70 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed 
                           transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-[11px] text-white/20">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] transition-colors
                                    ${currentPage === page 
                                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' 
                                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}
                    >
                        {page}
                    </button>
                )
            ))}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[11px] text-white/40 
                           hover:text-white/70 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed 
                           transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

// Portfolio Project Card
function PortfolioCard({ project }) {
    const [imgError, setImgError] = useState(false);
    const src = project.thumbnail && !imgError 
        ? project.thumbnail 
        : getDefaultThumbnail('Coming Soon');

    return (
        <Link
            href={`/proyek/${project.id}`}
            className="group rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.02] 
                       hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 block"
        >
            <div className="relative h-[175px] overflow-hidden bg-white/[0.03]">
                <img
                    src={src}
                    alt={project.title}
                    loading="lazy"
                    className={`w-full h-full transition-transform duration-300 ${
                        project.thumbnail && !imgError ? 'object-cover group-hover:scale-105' : 'object-cover'
                    }`}
                    onError={() => setImgError(true)}
                />
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
                            e.stopPropagation();
                            e.preventDefault();
                            window.open(project.demo_url, '_blank', 'noopener,noreferrer');
                        }}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 border border-white/10 
                                   flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity 
                                   hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/20"
                        aria-label={`Open demo: ${project.title}`}
                    >
                        <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </button>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-[13.5px] font-semibold text-white mb-1">{project.title}</h3>
                <p className="text-[12.5px] text-white/40 leading-relaxed line-clamp-2">{project.description}</p>
                {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tech_stack.slice(0, 6).map((tech, i) => (
                            <TechIcon key={i} slug={tech} />
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

// GitHub/GitLab Repo Card
function RepoCard({ repo, platform }) {
    const isGitHub = platform === 'github';
    const PlatformIcon = isGitHub ? Github : Gitlab;
    
    return (
        <a
            href={repo.html_url || repo.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 
                       hover:bg-white/[0.05] hover:border-yellow-400/30 transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <PlatformIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <h3 className="text-[13px] font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                        {repo.name}
                    </h3>
                </div>
                {repo.fork && (
                    <span className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded flex-shrink-0 border border-white/10">
                        fork
                    </span>
                )}
            </div>
            
            {(repo.description || repo.description_html) && (
                <p className="text-[11.5px] text-white/50 mb-3 line-clamp-2 leading-relaxed min-h-[2.75rem]"
                   dangerouslySetInnerHTML={{ __html: repo.description || repo.description_html }} />
            )}
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {repo.language && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getLanguageColor(repo.language, platform)}`}>
                        {repo.language}
                    </span>
                )}
                {repo.topics?.slice(0, 2).map(topic => (
                    <span key={topic} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        #{topic}
                    </span>
                ))}
            </div>
            
            <div className="flex items-center gap-3 text-[10.5px] text-white/35">
                <span className="flex items-center gap-1 hover:text-white/60 transition-colors" title="Stars">
                    <Star className="w-3.5 h-3.5" />
                    {formatNumber(isGitHub ? repo.stargazers_count : repo.star_count)}
                </span>
                <span className="flex items-center gap-1 hover:text-white/60 transition-colors" title="Forks">
                    <GitBranch className="w-3.5 h-3.5" />
                    {formatNumber(isGitHub ? repo.forks_count : repo.forks_count)}
                </span>
                <span className="flex items-center gap-1 hover:text-white/60 transition-colors ml-auto" title="Last updated">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(isGitHub ? repo.updated_at : repo.last_activity_at)}
                </span>
            </div>
        </a>
    );
}

// Empty State
function EmptyState({ message, onReset }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <FolderGit2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-[13px] text-white/50 mb-1">{message}</p>
            <p className="text-[11px] text-white/30 mb-4">Coba kata kunci lain atau reset pencarian</p>
            {onReset && (
                <button onClick={onReset} className="text-[11px] text-yellow-400 hover:text-yellow-300 transition-colors">
                    Reset pencarian →
                </button>
            )}
        </div>
    );
}

// Error State
function ErrorState({ error, onRetry }) {
    return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-6 text-center">
            <svg className="w-8 h-8 text-red-400/60 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p className="text-[13px] text-red-300/80 mb-1">Gagal memuat data</p>
            <p className="text-[11px] text-white/30 mb-4">{error}</p>
            <button onClick={onRetry} className="text-[11px] text-yellow-400 hover:text-yellow-300 transition-colors">
                Coba lagi →
            </button>
        </div>
    );
}

// ── Main Component ──
export default function Projects({ projects: portfolioProjects }) {
    const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'github' | 'gitlab'
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showForks, setShowForks] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const debouncedSearch = useDebounce(searchQuery, DEBOUNCE_DELAY);
    
    // Fetch data
    const { repos: githubRepos, loading: githubLoading, error: githubError, refetch: refetchGithub } = useGitHubRepos(GITHUB_USERNAME);
    const { repos: gitlabRepos, loading: gitlabLoading, error: gitlabError, refetch: refetchGitlab } = useGitLabRepos(GITLAB_USERNAME);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    // Reset page when tab or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, debouncedSearch, showForks]);

    // Get current data based on active tab
    const getCurrentData = useMemo(() => {
        if (activeTab === 'portfolio') {
            return {
                data: portfolioProjects || [],
                loading: loading,
                error: null,
                refetch: () => {},
            };
        } else if (activeTab === 'github') {
            return {
                data: githubRepos,
                loading: githubLoading,
                error: githubError,
                refetch: refetchGithub,
            };
        } else {
            return {
                data: gitlabRepos,
                loading: gitlabLoading,
                error: gitlabError,
                refetch: refetchGitlab,
            };
        }
    }, [activeTab, portfolioProjects, githubRepos, gitlabRepos, loading, githubLoading, gitlabLoading, githubError, gitlabError, refetchGithub, refetchGitlab]);

    // Filter data
    const filteredData = useMemo(() => {
        let result = getCurrentData.data;
        
        if (activeTab !== 'portfolio' && !showForks) {
            result = result.filter(repo => !repo.fork);
        }
        
        if (debouncedSearch.trim()) {
            const query = debouncedSearch.toLowerCase();
            result = result.filter(item => {
                const name = (item.name || item.title || '').toLowerCase();
                const desc = (item.description || item.description_html || '').toLowerCase();
                const lang = (item.language || '').toLowerCase();
                const topics = (item.topics || []).join(' ').toLowerCase();
                const techStack = (item.tech_stack || []).join(' ').toLowerCase();
                
                return name.includes(query) || desc.includes(query) || lang.includes(query) || topics.includes(query) || techStack.includes(query);
            });
        }
        
        return result;
    }, [getCurrentData.data, activeTab, debouncedSearch, showForks]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / REPOS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * REPOS_PER_PAGE;
        return filteredData.slice(start, start + REPOS_PER_PAGE);
    }, [filteredData, currentPage]);

    // Stats
    const stats = useMemo(() => {
        if (activeTab === 'portfolio') {
            return { count: filteredData.length, label: 'proyek' };
        } else {
            const totalStars = filteredData.reduce((sum, r) => sum + (activeTab === 'github' ? r.stargazers_count : r.star_count || 0), 0);
            const totalForks = filteredData.reduce((sum, r) => sum + (r.forks_count || 0), 0);
            return { 
                count: filteredData.length, 
                stars: totalStars, 
                forks: totalForks,
                label: 'repository'
            };
        }
    }, [filteredData, activeTab]);

    // Tab config
    const tabs = [
        { id: 'portfolio', label: 'Portfolio', icon: FolderGit2, count: portfolioProjects?.length || 0 },
        { id: 'github', label: 'GitHub', icon: Github, count: githubRepos.filter(r => !r.fork).length },
        { id: 'gitlab', label: 'GitLab', icon: Gitlab, count: gitlabRepos.length },
    ];

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

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all
                                            ${isActive 
                                                ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' 
                                                : 'bg-white/[0.03] text-white/50 hover:text-white/70 hover:bg-white/[0.06] border border-transparent'
                                            }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-yellow-400/30 text-yellow-200' : 'bg-white/10 text-white/40'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <SearchInput 
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder={activeTab === 'portfolio' 
                                ? 'Cari proyek, teknologi...' 
                                : `Cari ${activeTab} project, bahasa, topik...`
                            }
                        />
                    </div>
                    {activeTab !== 'portfolio' && (
                        <div className="flex items-center gap-3">
                            <FilterToggle 
                                label="Include forks" 
                                checked={showForks} 
                                onChange={setShowForks} 
                            />
                            <button
                                onClick={getCurrentData.refetch}
                                disabled={getCurrentData.loading}
                                className="h-9 px-3 bg-white/[0.04] border border-white/[0.08] rounded-lg 
                                           text-[11px] text-white/50 hover:text-white/70 hover:bg-white/[0.06] 
                                           disabled:opacity-40 transition-colors flex items-center gap-1.5"
                            >
                                <svg className={`w-3.5 h-3.5 ${getCurrentData.loading ? 'animate-spin' : ''}`} 
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                {!getCurrentData.loading && !getCurrentData.error && (
                    <div className="flex flex-wrap gap-4 text-[11px]">
                        <span className="text-white/35">
                            <span className="text-white/70 font-medium">{stats.count}</span> {stats.label}
                        </span>
                        {activeTab !== 'portfolio' && (
                            <>
                                <span className="text-white/35">
                                    <span className="text-yellow-400 font-medium">{formatNumber(stats.stars)}</span> total stars
                                </span>
                                <span className="text-white/35">
                                    <span className="text-white/70 font-medium">{formatNumber(stats.forks)}</span> total forks
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* Content */}
                {getCurrentData.loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(REPOS_PER_PAGE)].map((_, i) => (
                            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse">
                                <div className="h-[175px] bg-white/[0.03]" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-white/10 rounded w-full" />
                                    <div className="h-3 bg-white/10 rounded w-2/3" />
                                    <div className="flex gap-2 pt-2">
                                        {[1,2,3,4].map(j => (
                                            <div key={j} className="w-7 h-7 rounded-full bg-white/10" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : getCurrentData.error ? (
                    <ErrorState error={getCurrentData.error} onRetry={getCurrentData.refetch} />
                ) : filteredData.length === 0 ? (
                    <EmptyState 
                        message={searchQuery ? 'Tidak ada project yang cocok' : 'Belum ada project'} 
                        onReset={searchQuery ? () => setSearchQuery('') : null}
                    />
                ) : (
                    <>
                        <p className="text-[11px] text-white/30 mb-3">
                            Menampilkan {paginatedData.length} dari {filteredData.length} {activeTab === 'portfolio' ? 'proyek' : 'repository'}
                            {debouncedSearch && ` untuk "${debouncedSearch}"`}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paginatedData.map(item => (
                                activeTab === 'portfolio' ? (
                                    <PortfolioCard key={item.id} project={item} />
                                ) : (
                                    <RepoCard key={item.id} repo={item} platform={activeTab} />
                                )
                            ))}
                        </div>
                        
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={setCurrentPage} 
                        />
                    </>
                )}

            </div>
        </MainLayout>
    );
}