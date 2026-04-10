<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // ── Counts ──────────────────────────────────────────────────────────────
        $totalProjects     = Project::count();
        $featuredProjects  = Project::where('is_featured', true)->count();
        $totalSkills       = Skill::count();
        $totalAchievements = Achievement::count();
        $totalEducations   = Education::count();
        $totalExperiences  = Experience::count();
        $totalMessages     = Message::count();
        $unreadMessages    = Message::unread()->count();
        $readMessages      = Message::read()->count();
        $trashedMessages   = Message::onlyTrashed()->count();

        // ── Messages per month (last 12 months) ──────────────────────────────
        $messagesPerMonth = Message::withTrashed()
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        // Fill missing months with 0
        $messageChart = [];
        for ($i = 11; $i >= 0; $i--) {
            $key  = Carbon::now()->subMonths($i)->format('Y-m');
            $label = Carbon::now()->subMonths($i)->translatedFormat('M Y');
            $messageChart[] = [
                'month' => $label,
                'count' => $messagesPerMonth[$key]->count ?? 0,
            ];
        }

        // ── Projects by featured vs non-featured ────────────────────────────
        $projectsFeaturedChart = [
            ['label' => 'Featured',     'value' => $featuredProjects],
            ['label' => 'Non-Featured', 'value' => $totalProjects - $featuredProjects],
        ];

        // ── Achievements by type ─────────────────────────────────────────────
        $achievementsByType = Achievement::select('type', DB::raw('COUNT(*) as count'))
            ->groupBy('type')
            ->get()
            ->map(fn($row) => ['label' => ucfirst($row->type ?? 'Other'), 'value' => $row->count])
            ->toArray();

        if (empty($achievementsByType)) {
            $achievementsByType = [['label' => 'Belum ada data', 'value' => 0]];
        }

        // ── Achievements by category ─────────────────────────────────────────
        $achievementsByCategory = Achievement::select('category', DB::raw('COUNT(*) as count'))
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(fn($row) => ['label' => $row->category, 'value' => $row->count])
            ->toArray();

        // ── Messages: read vs unread ─────────────────────────────────────────
        $messageStatusChart = [
            ['label' => 'Belum Dibaca', 'value' => $unreadMessages],
            ['label' => 'Sudah Dibaca', 'value' => $readMessages],
        ];

        // ── Recent messages (5 latest) ────────────────────────────────────────
        $recentMessages = Message::latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'subject', 'read_at', 'created_at'])
            ->map(fn($m) => [
                'id'         => $m->id,
                'name'       => $m->name,
                'email'      => $m->email,
                'subject'    => $m->subject,
                'is_read'    => !is_null($m->read_at),
                'created_at' => $m->created_at->diffForHumans(),
            ]);

        // ── Recent projects ───────────────────────────────────────────────────
        $recentProjects = Project::latest()
            ->limit(5)
            ->get(['id', 'title', 'is_featured', 'created_at'])
            ->map(fn($p) => [
                'id'          => $p->id,
                'title'       => $p->title,
                'is_featured' => $p->is_featured,
                'created_at'  => $p->created_at->diffForHumans(),
            ]);

        // ── Skills count by color (top 5) ─────────────────────────────────────
        $skillsByColor = Skill::select('color', DB::raw('COUNT(*) as count'))
            ->whereNotNull('color')
            ->groupBy('color')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(fn($row) => ['label' => $row->color, 'value' => $row->count])
            ->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects'     => $totalProjects,
                'skills'       => $totalSkills,
                'achievements' => $totalAchievements,
                'educations'   => $totalEducations,
                'experiences'  => $totalExperiences,
                'messages'     => $totalMessages,
                'unread'       => $unreadMessages,
                'trashed'      => $trashedMessages,
            ],
            'charts' => [
                'messagesPerMonth'      => $messageChart,
                'projectsFeatured'      => $projectsFeaturedChart,
                'achievementsByType'    => $achievementsByType,
                'achievementsByCategory' => $achievementsByCategory,
                'messageStatus'         => $messageStatusChart,
                'skillsByColor'         => $skillsByColor,
            ],
            'recent' => [
                'messages' => $recentMessages,
                'projects' => $recentProjects,
            ],
        ]);
    }
}
