<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
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
        $skills = \App\Models\Skill::ordered()->get(['id', 'name', 'color', 'icon_url']);

        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
            'mode'    => 'create',
            'skills'  => $skills,
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

        if (empty($validated['order'])) {
            $validated['order'] = Project::count() + 1;
        }

        Project::create($validated);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project berhasil ditambahkan.');
    }

    public function edit(Project $project)
    {
        $skills = \App\Models\Skill::ordered()->get(['id', 'name', 'color', 'icon_url']);

        return Inertia::render('Admin/Projects/Form', [
            // Load existing portfolio images
            'project' => $project->load('images'),
            'mode'    => 'edit',
            'skills'  => $skills,
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

        // Hapus semua portfolio images
        foreach ($project->images as $img) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $img->url));
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

        $projects = Project::with('images')->whereIn('id', $request->ids)->get();

        foreach ($projects as $project) {
            if ($project->thumbnail && str_starts_with($project->thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $project->thumbnail));
            }
            foreach ($project->images as $img) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $img->url));
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
                'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            ], [
                'image.required' => 'Gambar wajib diupload',
                'image.image'    => 'File harus berupa gambar',
                'image.max'      => 'Ukuran gambar maksimal 5MB',
            ]);

            if (!$request->hasFile('image')) {
                return response()->json(['message' => 'No file uploaded'], 400);
            }

            $path = $request->file('image')->store('projects/content', 'public');
            $url  = Storage::disk('public')->url($path);

            return response()->json(['url' => $url, 'success' => true], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Image upload error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  PORTFOLIO IMAGES  (unlimited gallery per project)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Upload satu atau lebih portfolio image
     * POST /admin/projects/{project}/images
     */
    public function uploadPortfolioImages(Request $request, Project $project)
    {
        $request->validate([
            'images'    => 'required|array|min:1',
            'images.*'  => 'image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        $uploaded = [];
        $nextOrder = $project->images()->max('order') + 1;

        foreach ($request->file('images') as $file) {
            $path = $file->store('projects/gallery', 'public');
            $img  = $project->images()->create([
                'url'   => '/storage/' . $path,
                'order' => $nextOrder++,
            ]);
            $uploaded[] = $img;
        }

        return response()->json([
            'success' => true,
            'images'  => $uploaded,
        ]);
    }

    /**
     * Update caption sebuah portfolio image
     * PATCH /admin/projects/{project}/images/{image}
     */
    public function updatePortfolioImage(Request $request, Project $project, ProjectImage $image)
    {
        abort_if($image->project_id !== $project->id, 403);

        $request->validate([
            'caption' => 'nullable|string|max:255',
            'order'   => 'nullable|integer|min:0',
        ]);

        $image->update($request->only('caption', 'order'));

        return response()->json(['success' => true, 'image' => $image]);
    }

    /**
     * Hapus satu portfolio image
     * DELETE /admin/projects/{project}/images/{image}
     */
    public function destroyPortfolioImage(Project $project, ProjectImage $image)
    {
        abort_if($image->project_id !== $project->id, 403);

        Storage::disk('public')->delete(str_replace('/storage/', '', $image->url));
        $image->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Reorder portfolio images (drag & drop)
     * POST /admin/projects/{project}/images/reorder
     */
    public function reorderPortfolioImages(Request $request, Project $project)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:project_images,id',
        ]);

        foreach ($request->ids as $order => $id) {
            $project->images()->where('id', $id)->update(['order' => $order]);
        }

        return response()->json(['success' => true]);
    }
}
