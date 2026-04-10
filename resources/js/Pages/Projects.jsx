// resources/js/Pages/Projects.jsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ProjectsPageSkeleton } from '@/Components/Skeleton';
import { 
    Star, ExternalLink, GitBranch, Gitlab, Github, FolderGit2, 
    Columns2, Columns3, RefreshCw 
} from 'lucide-react';

// ── Constants & Helpers ──
const GITHUB_USERNAME = 'IzzaWildanRidhoni';
const GITLAB_USERNAME = 'IzzaWildanRidhoni';
const REPOS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 300;

// ❌ HAPUS: const techColors = { ... } dan getLanguageColor()

// ✅ Helper: Cari skill dari array skills (case-insensitive)
const findSkill = (skills, techName) => {
    if (!skills || !techName) return null;
    const lowerName = techName.toLowerCase().trim();
    return skills.find(s => s.name.toLowerCase().trim() === lowerName) ||
           skills.find(s => s.name.toLowerCase().includes(lowerName)) ||
           skills.find(s => lowerName.includes(s.name.toLowerCase()));
};

// ✅ Helper: Generate color fallback yang konsisten berdasarkan nama
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
};

const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
};

const getDefaultThumbnail = (text) => {
    return `https://placehold.co/600x350/0f172a/64748b?text=${encodeURIComponent(text)}&font=roboto&font_size=20`;
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
                const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`);
                if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
                const data = await res.json();
                if (data.length === 0) break;
                allRepos = [...allRepos, ...data];
                const linkHeader = res.headers.get('Link');
                if (!linkHeader || !linkHeader.includes('rel="next"')) break;
                page++;
                if (page > 5) break;
            }
            setRepos(allRepos);
        } catch (err) {
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
            const userRes = await fetch(`https://gitlab.com/api/v4/users?username=${username}`);
            if (!userRes.ok) throw new Error(`GitLab User error: ${userRes.status}`);
            const users = await userRes.json();
            if (users.length === 0) throw new Error('User not found on GitLab');
            
            const userId = users[0].id;
            const projectsRes = await fetch(`https://gitlab.com/api/v4/users/${userId}/projects?order_by=updated_at&sort=desc&per_page=100`);
            if (!projectsRes.ok) throw new Error(`GitLab Projects error: ${projectsRes.status}`);
            const projects = await projectsRes.json();
            setRepos(projects);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => { fetchRepos(); }, [fetchRepos]);
    return { repos, loading, error, refetch: fetchRepos };
}

// ── Sub-Components ──

// ✅ TechIcon yang menggunakan skills dari database
function TechIcon({ slug, skills = [] }) {
    const skill = findSkill(skills, slug);
    const color = skill?.color || stringToColor(slug);
    const iconUrl = skill?.icon_url;
    
    return (
        <div 
            className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center overflow-hidden" 
            style={{ backgroundColor: color + '20' }} 
            title={slug}
        >
            {iconUrl ? (
                <img 
                    src={iconUrl} 
                    alt={slug} 
                    className="w-[15px] h-[15px] object-contain" 
                    onError={e => { 
                        e.target.style.display = 'none';
                        // Fallback ke simpleicons jika icon_url error
                        e.target.src = `https://cdn.simpleicons.org/${slug.toLowerCase().replace(/\s/g, '')}`;
                    }} 
                />
            ) : (
                <img 
                    src={`https://cdn.simpleicons.org/${slug.toLowerCase().replace(/\s/g, '')}`} 
                    alt={slug} 
                    className="w-[15px] h-[15px] object-contain" 
                    onError={e => { e.target.style.display = 'none'; }} 
                />
            )}
        </div>
    );
}

function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
                   className="w-full h-9 pl-9 pr-10 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[12px] text-white/70 placeholder-white/30 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition-all" />
            {value && (
                <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}
        </div>
    );
}

function FilterToggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-9 h-5 rounded-full transition-colors relative ${checked ? 'bg-yellow-400/30' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-yellow-400 m-0.5 transition-transform absolute top-0 left-0 ${checked ? 'translate-x-4' : ''}`} />
            </div>
            <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">{label}</span>
        </label>
    );
}

function GridToggle({ value, onChange }) {
    return (
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5">
            <button onClick={() => onChange(2)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] transition-all ${value === 2 ? 'bg-yellow-400/20 text-yellow-300' : 'text-white/40 hover:text-white/60'}`} title="2 Kolom">
                <Columns2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onChange(3)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] transition-all ${value === 3 ? 'bg-yellow-400/20 text-yellow-300' : 'text-white/40 hover:text-white/60'}`} title="3 Kolom">
                <Columns3 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); } 
        else {
            if (currentPage <= 3) { for (let i = 1; i <= 4; i++) pages.push(i); pages.push('...'); pages.push(totalPages); } 
            else if (currentPage >= totalPages - 2) { pages.push(1); pages.push('...'); for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i); } 
            else { pages.push(1); pages.push('...'); for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i); pages.push('...'); pages.push(totalPages); }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            {getPageNumbers().map((page, idx) => (
                page === '...' ? <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-[11px] text-white/20">...</span> :
                <button key={page} onClick={() => onPageChange(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] transition-colors ${currentPage === page ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>{page}</button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
}

// ✅ PortfolioCard menerima prop skills
function PortfolioCard({ project, skills = [] }) {
    const [imgError, setImgError] = useState(false);
    const src = project.thumbnail && !imgError ? project.thumbnail : getDefaultThumbnail('Coming Soon');
    
    return (
        <Link href={`/proyek/${project.id}`} className="group rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 block">
            <div className="relative h-[175px] overflow-hidden bg-white/[0.03]">
                <img src={src} alt={project.title} loading="lazy" className={`w-full h-full transition-transform duration-300 ${project.thumbnail && !imgError ? 'object-cover group-hover:scale-105' : 'object-cover'}`} onError={() => setImgError(true)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                {project.is_featured && <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-yellow-400 text-black text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg"><Star className="w-3 h-3" />Featured</div>}
                {project.demo_url && <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(project.demo_url, '_blank'); }} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"><ExternalLink className="w-3.5 h-3.5 text-white" /></button>}
            </div>
            <div className="p-4">
                <h3 className="text-[13.5px] font-semibold text-white mb-1">{project.title}</h3>
                <p className="text-[12.5px] text-white/40 leading-relaxed line-clamp-2">{project.description}</p>
                {project.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tech_stack.slice(0, 6).map((tech, i) => (
                            <TechIcon key={i} slug={tech} skills={skills} />
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

function RepoCard({ repo, platform }) {
    const PlatformIcon = platform === 'github' ? Github : Gitlab;
    
    // ✅ Untuk repo, tetap pakai getLanguageColor sederhana karena tidak dari database
    const getLanguageColor = (lang) => {
        const colors = {
            'JavaScript': 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
            'TypeScript': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
            'PHP': 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30',
            'Python': 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
            'Go': 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
            'Kotlin': 'bg-purple-400/20 text-purple-300 border-purple-400/30',
            'Java': 'bg-orange-400/20 text-orange-300 border-orange-400/30',
            'HTML': 'bg-orange-400/20 text-orange-300 border-orange-400/30',
            'CSS': 'bg-pink-400/20 text-pink-300 border-pink-400/30',
        };
        return colors[lang] || 'bg-white/10 text-white/60 border-white/20';
    };
    
    return (
        <a href={repo.html_url || repo.web_url} target="_blank" rel="noopener noreferrer" className="group block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-yellow-400/30 transition-all duration-200">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <PlatformIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <h3 className="text-[13px] font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">{repo.name}</h3>
                </div>
                {repo.fork && <span className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded flex-shrink-0 border border-white/10">fork</span>}
            </div>
            <p className="text-[11.5px] text-white/50 mb-3 line-clamp-2 leading-relaxed min-h-[2.75rem]">{repo.description}</p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {repo.language && <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getLanguageColor(repo.language)}`}>{repo.language}</span>}
                {repo.topics?.slice(0, 2).map(topic => <span key={topic} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">#{topic}</span>)}
            </div>
            <div className="flex items-center gap-3 text-[10.5px] text-white/35">
                <span className="flex items-center gap-1 hover:text-white/60 transition-colors"><Star className="w-3.5 h-3.5" />{formatNumber(platform === 'github' ? repo.stargazers_count : repo.star_count)}</span>
                <span className="flex items-center gap-1 hover:text-white/60 transition-colors"><GitBranch className="w-3.5 h-3.5" />{formatNumber(repo.forks_count)}</span>
                <span className="flex items-center gap-1 hover:text-white/60 transition-colors ml-auto">{formatDate(platform === 'github' ? repo.updated_at : repo.last_activity_at)}</span>
            </div>
        </a>
    );
}

// ── Main Component ──
// ✅ Terima prop skills dari controller
export default function Projects({ projects: portfolioProjects, skills = [] }) {
    const [activeTab, setActiveTab] = useState('portfolio');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showForks, setShowForks] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Grid Layout State
    const [gridCols, setGridCols] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('projects_grid_cols');
            return saved ? parseInt(saved, 10) : 3;
        }
        return 3;
    });

    useEffect(() => { localStorage.setItem('projects_grid_cols', gridCols.toString()); }, [gridCols]);

    const debouncedSearch = useDebounce(searchQuery, DEBOUNCE_DELAY);
    const { repos: githubRepos, loading: githubLoading, error: githubError, refetch: refetchGithub } = useGitHubRepos(GITHUB_USERNAME);
    const { repos: gitlabRepos, loading: gitlabLoading, error: gitlabError, refetch: refetchGitlab } = useGitLabRepos(GITLAB_USERNAME);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => { setCurrentPage(1); }, [activeTab, debouncedSearch, showForks, gridCols]);

    const getCurrentData = useMemo(() => {
        if (activeTab === 'portfolio') return { data: portfolioProjects || [], loading: loading, error: null, refetch: () => {} };
        if (activeTab === 'github') return { data: githubRepos, loading: githubLoading, error: githubError, refetch: refetchGithub };
        return { data: gitlabRepos, loading: gitlabLoading, error: gitlabError, refetch: refetchGitlab };
    }, [activeTab, portfolioProjects, githubRepos, gitlabRepos, loading, githubLoading, gitlabLoading, githubError, gitlabError, refetchGithub, refetchGitlab]);

    const filteredData = useMemo(() => {
        let result = getCurrentData.data;
        if (activeTab !== 'portfolio' && !showForks) result = result.filter(repo => !repo.fork);
        if (debouncedSearch.trim()) {
            const query = debouncedSearch.toLowerCase();
            result = result.filter(item => {
                const name = (item.name || item.title || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();
                const lang = (item.language || '').toLowerCase();
                const tech = (item.tech_stack || []).join(' ').toLowerCase();
                return name.includes(query) || desc.includes(query) || lang.includes(query) || tech.includes(query);
            });
        }
        return result;
    }, [getCurrentData.data, activeTab, debouncedSearch, showForks]);

    const totalPages = Math.ceil(filteredData.length / REPOS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * REPOS_PER_PAGE;
        return filteredData.slice(start, start + REPOS_PER_PAGE);
    }, [filteredData, currentPage]);

    const gridClass = gridCols === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

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
                    <p className="text-[13px] text-white/40">Etalase proyek pribadi maupun open-source yang telah saya bangun.</p>
                </div>
                <div className="border-t border-white/[0.07]" />

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'bg-white/[0.03] text-white/50 hover:text-white/70 hover:bg-white/[0.06] border border-transparent'}`}>
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-yellow-400/30 text-yellow-200' : 'bg-white/10 text-white/40'}`}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex-1 w-full sm:w-auto">
                        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={activeTab === 'portfolio' ? 'Cari proyek, teknologi...' : `Cari ${activeTab} project, bahasa...`} />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <GridToggle value={gridCols} onChange={setGridCols} />
                        {activeTab !== 'portfolio' && (
                            <>
                                <FilterToggle label="Forks" checked={showForks} onChange={setShowForks} />
                                <button onClick={getCurrentData.refetch} disabled={getCurrentData.loading} className="h-9 w-9 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/50 hover:text-white/70 hover:bg-white/[0.06] disabled:opacity-40 transition-colors" title="Refresh">
                                    <RefreshCw className={`w-3.5 h-3.5 ${getCurrentData.loading ? 'animate-spin' : ''}`} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats */}
                {!getCurrentData.loading && !getCurrentData.error && (
                    <div className="flex flex-wrap gap-4 text-[11px]">
                        <span className="text-white/35"><span className="text-white/70 font-medium">{filteredData.length}</span> {activeTab === 'portfolio' ? 'proyek' : 'repository'}</span>
                        {activeTab !== 'portfolio' && (
                            <>
                                <span className="text-white/35"><span className="text-yellow-400 font-medium">{formatNumber(filteredData.reduce((sum, r) => sum + (activeTab === 'github' ? r.stargazers_count : r.star_count || 0), 0))}</span> stars</span>
                                <span className="text-white/35"><span className="text-white/70 font-medium">{formatNumber(filteredData.reduce((sum, r) => sum + (r.forks_count || 0), 0))}</span> forks</span>
                            </>
                        )}
                    </div>
                )}

                {/* Content Area */}
                {getCurrentData.loading ? (
                    <ProjectsPageSkeleton />
                ) : getCurrentData.error ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-6 text-center">
                        <p className="text-[13px] text-red-300/80 mb-2">Gagal memuat data</p>
                        <button onClick={getCurrentData.refetch} className="text-[11px] text-yellow-400 hover:text-yellow-300">Coba lagi</button>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
                        <FolderGit2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
                        <p className="text-[13px] text-white/50">Tidak ada project yang ditemukan</p>
                    </div>
                ) : (
                    <>
                        <p className="text-[11px] text-white/30 mb-3">Menampilkan {paginatedData.length} dari {filteredData.length} hasil</p>
                        <div className={gridClass}>
                            {paginatedData.map(item => (
                                activeTab === 'portfolio' 
                                    ? <PortfolioCard key={item.id} project={item} skills={skills} /> 
                                    : <RepoCard key={item.id} repo={item} platform={activeTab} />
                            ))}
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>
        </MainLayout>
    );
}