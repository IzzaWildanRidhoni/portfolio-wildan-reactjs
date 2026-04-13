<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blogs/Form', [
            'blog' => null,
            'mode' => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:blogs,slug',
            'excerpt'          => 'nullable|string|max:500',
            'content'          => 'nullable|string',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string|max:50',
            'is_published'     => 'boolean',
            'published_at'     => 'nullable|date',
            'order'            => 'nullable|integer|min:0',
            'thumbnail'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        // Auto-generate slug
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = '/storage/' . $request->file('thumbnail')->store('blogs', 'public');
        }

        // Default order
        if (empty($validated['order'])) {
            $validated['order'] = Blog::count() + 1;
        }

        // Set published_at jika is_published true dan belum ada
        if (!empty($validated['is_published']) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Blog::create($validated);

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog berhasil ditambahkan.');
    }

    public function edit(Blog $blog)
    {
        return Inertia::render('Admin/Blogs/Form', [
            'blog' => $blog,
            'mode' => 'edit',
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:blogs,slug,' . $blog->id,
            'excerpt'          => 'nullable|string|max:500',
            'content'          => 'nullable|string',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string|max:50',
            'is_published'     => 'boolean',
            'published_at'     => 'nullable|date',
            'order'            => 'nullable|integer|min:0',
            'thumbnail'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        // Auto-generate slug jika diubah
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            if ($blog->thumbnail && str_starts_with($blog->thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $blog->thumbnail));
            }
            $validated['thumbnail'] = '/storage/' . $request->file('thumbnail')->store('blogs', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        // Auto-set published_at
        if (!empty($validated['is_published']) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog berhasil diperbarui.');
    }

    public function destroy(Blog $blog)
    {
        if ($blog->thumbnail && str_starts_with($blog->thumbnail, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $blog->thumbnail));
        }
        $blog->delete();

        return back()->with('success', 'Blog berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:blogs,id',
        ]);

        $blogs = Blog::whereIn('id', $request->ids)->get();
        foreach ($blogs as $blog) {
            if ($blog->thumbnail && str_starts_with($blog->thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $blog->thumbnail));
            }
        }
        Blog::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' blog berhasil dihapus.');
    }

    /**
     * Upload image dari TipTap editor
     */
    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            ], [
                'image.required' => 'Gambar wajib diupload',
                'image.image' => 'File harus berupa gambar',
                'image.max' => 'Ukuran gambar maksimal 5MB',
            ]);

            if (!$request->hasFile('image')) {
                return response()->json(['message' => 'No file uploaded'], 400);
            }

            $path = $request->file('image')->store('blogs/content', 'public');
            $url = Storage::disk('public')->url($path);

            return response()->json(['url' => $url, 'success' => true], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Blog image upload error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }
}