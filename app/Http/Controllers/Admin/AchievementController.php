<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function index()
    {
        // Ambil semua data, urutkan berdasarkan created_at desc
        // Client yang akan handle filter, search, sort, dan pagination
        $achievements = Achievement::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Achievements/Index', [
            'achievements' => $achievements, // Array collection, bukan paginator
            'filters'      => [], // Tidak perlu kirim filters ke client untuk initial state
        ]);
    }
    public function create()
    {
        return Inertia::render('Admin/Achievements/Form', [
            'achievement' => null,
            'mode'        => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'issuer'         => 'required|string|max:255',
            'credential_id'  => 'nullable|string|max:255',
            'issued_date'    => 'required|string|max:50',
            'type'           => 'required|in:Profesional,Course,Certificate,Badge',
            'category'       => 'required|in:Backend,Frontend,Mobile,DevOps,Design,Freelance',
            'credential_url' => 'nullable|url|max:500',
            'thumbnail'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('achievements', 'public');
            $validated['thumbnail'] = '/storage/' . $validated['thumbnail'];
        }

        Achievement::create($validated);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement berhasil ditambahkan.');
    }

    public function edit(Achievement $achievement)
    {
        return Inertia::render('Admin/Achievements/Form', [
            'achievement' => $achievement,
            'mode'        => 'edit',
        ]);
    }

    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'issuer'         => 'required|string|max:255',
            'credential_id'  => 'nullable|string|max:255',
            'issued_date'    => 'required|string|max:50',
            'type'           => 'required|in:Profesional,Course,Certificate,Badge',
            'category'       => 'required|in:Backend,Frontend,Mobile,DevOps,Design,Freelance',
            'credential_url' => 'nullable|url|max:500',
            'thumbnail'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($achievement->thumbnail && str_starts_with($achievement->thumbnail, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $achievement->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }

            $validated['thumbnail'] = '/storage/' . $request->file('thumbnail')->store('achievements', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        $achievement->update($validated);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement berhasil diperbarui.');
    }

    public function destroy(Achievement $achievement)
    {
        if ($achievement->thumbnail && str_starts_with($achievement->thumbnail, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $achievement->thumbnail);
            Storage::disk('public')->delete($oldPath);
        }

        $achievement->delete();

        return back()->with('success', 'Achievement berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:achievements,id',
        ]);

        $achievements = Achievement::whereIn('id', $request->ids)->get();

        foreach ($achievements as $achievement) {
            if ($achievement->thumbnail && str_starts_with($achievement->thumbnail, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $achievement->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
        }

        Achievement::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' achievement berhasil dihapus.');
    }
}
