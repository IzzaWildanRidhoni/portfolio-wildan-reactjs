<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use App\Models\Skill;

class ProjectController extends Controller
{
    public function index()
    {
        // ✅ Ambil semua skills untuk lookup color & icon
        $skills = Skill::select('id', 'name', 'color', 'icon_url')->get();

        return Inertia::render('Projects', [
            'projects' => Project::orderBy('order')->get(),
            'skills'   => $skills, // ✅ Kirim skills ke frontend
        ]);
    }

    public function show(Project $project)
    {
        // Ambil semua skills untuk lookup color & icon
        $skillsLookup = Skill::all()->keyBy('name');

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'skillsLookup'  => $skillsLookup,
        ]);
    }
}
