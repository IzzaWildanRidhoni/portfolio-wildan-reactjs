<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Models\Achievement;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'projects' => Project::count(),
                'achievements' => Achievement::count(),
            ],
        ]);
    }
}
