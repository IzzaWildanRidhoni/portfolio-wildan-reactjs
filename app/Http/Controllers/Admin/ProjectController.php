<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
            'mode'    => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'demo_url'    => 'nullable|url|max:500',
            'repo_url'    => 'nullable|url|max:500',
            'tech_stack'  => 'nullable|array',
            'tech_stack.*' => 'string|max:50',
            'is_featured' => 'boolean',
            'order'       => 'nullable|integer|min:0',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = '/storage/' . $request->file('thumbnail')->store('projects', 'public');
        }

        // Default order = jumlah project yang ada + 1
        if (empty($validated['order'])) {
            $validated['order'] = Project::count() + 1;
        }

        Project::create($validated);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project berhasil ditambahkan.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => $project,
            'mode'    => 'edit',
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'demo_url'    => 'nullable|url|max:500',
            'repo_url'    => 'nullable|url|max:500',
            'tech_stack'  => 'nullable|array',
            'tech_stack.*' => 'string|max:50',
            'is_featured' => 'boolean',
            'order'       => 'nullable|integer|min:0',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Hapus thumbnail lama
            if ($project->thumbnail && str_starts_with($project->thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $project->thumbnail));
            }
            $validated['thumbnail'] = '/storage/' . $request->file('thumbnail')->store('projects', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        $project->update($validated);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project berhasil diperbarui.');
    }

    public function destroy(Project $project)
    {
        if ($project->thumbnail && str_starts_with($project->thumbnail, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $project->thumbnail));
        }

        $project->delete();

        return back()->with('success', 'Project berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:projects,id',
        ]);

        $projects = Project::whereIn('id', $request->ids)->get();

        foreach ($projects as $project) {
            if ($project->thumbnail && str_starts_with($project->thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $project->thumbnail));
            }
        }

        Project::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' project berhasil dihapus.');
    }

    /**
     * Upload image dari TipTap editor (inline image di description)
     */
    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120', // 5MB
            ], [
                'image.required' => 'Gambar wajib diupload',
                'image.image' => 'File harus berupa gambar',
                'image.max' => 'Ukuran gambar maksimal 5MB',
            ]);

            if (!$request->hasFile('image')) {
                return response()->json(['message' => 'No file uploaded'], 400);
            }

            $path = $request->file('image')->store('projects/content', 'public');

            // ✅ Pastikan URL menggunakan asset() helper jika perlu
            $url = Storage::disk('public')->url($path);
            // Atau jika ingin relative path:
            // $url = '/storage/' . $path;

            return response()->json([
                'url' => $url,
                'success' => true,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Image upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
