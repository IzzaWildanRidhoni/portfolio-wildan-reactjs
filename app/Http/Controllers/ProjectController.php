<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Models\Skill;

class ProjectController extends Controller
{
    public function index()
    {
        $skills = Skill::select('id', 'name', 'color', 'icon_url')->get();

        return Inertia::render('Projects', [
            'projects' => Project::orderBy('order')->get(),
            'skills'   => $skills,
        ]);
    }

    public function show(Project $project)
    {
        $skillsLookup = Skill::all()->keyBy('name');

        return Inertia::render('Projects/Show', [
            // ✅ Load portfolio images sekaligus
            'project'      => $project->load('images'),
            'skillsLookup' => $skillsLookup,
        ]);
    }
}
