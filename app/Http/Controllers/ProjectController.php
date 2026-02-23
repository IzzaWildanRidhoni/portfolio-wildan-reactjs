<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Projects', [
            'projects' => Project::orderBy('order')->get(),
        ]);
    }

    public function show(Project $project)
    {
        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }
}
