<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('order', 'asc')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $skills,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Skills/Form', [
            'skill' => null,
            'mode'  => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'icon_url' => 'nullable|url|max:255',
            'color'    => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'order'    => 'nullable|integer|min:0',
        ]);

        Skill::create($validated);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil ditambahkan.');
    }

    public function edit(Skill $skill)
    {
        return Inertia::render('Admin/Skills/Form', [
            'skill' => $skill,
            'mode'  => 'edit',
        ]);
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'icon_url' => 'nullable|url|max:255',
            'color'    => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'order'    => 'nullable|integer|min:0',
        ]);

        $skill->update($validated);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil diperbarui.');
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return back()->with('success', 'Skill berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:skills,id',
        ]);

        Skill::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' skill berhasil dihapus.');
    }
}
