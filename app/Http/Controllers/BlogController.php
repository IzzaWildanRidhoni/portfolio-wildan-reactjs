<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Blog;
use App\Models\BlogCategory;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('category')
            ->published()
            ->ordered()
            ->get()
            ->map(fn($blog) => [
                'id'               => $blog->id,
                'title'            => $blog->title,
                'slug'             => $blog->slug,
                'excerpt'          => $blog->excerpt,
                'thumbnail'        => $blog->thumbnail,
                'tags'             => $blog->tags ?? [],
                'is_published'     => $blog->is_published,
                'published_at'     => $blog->published_at?->toISOString(),
                'views'            => $blog->views,
                'blog_category_id' => $blog->blog_category_id,
                'category'         => $blog->category ? [
                    'id'    => $blog->category->id,
                    'name'  => $blog->category->name,
                    'slug'  => $blog->category->slug,
                    'color' => $blog->category->color,
                ] : null,
            ]);

        $categories = BlogCategory::orderBy('order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'color']);

        return Inertia::render('Blog/Index', [
            'blogs'      => $blogs,
            'categories' => $categories,
        ]);
    }

    public function show(Blog $blog)
    {
        // Hanya tampilkan yang published
        abort_unless($blog->is_published, 404);

        // Increment views
        $blog->increment('views');

        // Blog related (same category atau sama tags), exclude current
        $related = Blog::with('category')
            ->published()
            ->where('id', '!=', $blog->id)
            ->where(function ($q) use ($blog) {
                if ($blog->blog_category_id) {
                    $q->where('blog_category_id', $blog->blog_category_id);
                }
                if (!empty($blog->tags)) {
                    $q->orWhereJsonContains('tags', $blog->tags[0] ?? '');
                }
            })
            ->ordered()
            ->limit(3)
            ->get()
            ->map(fn($b) => [
                'id'           => $b->id,
                'title'        => $b->title,
                'slug'         => $b->slug,
                'excerpt'      => $b->excerpt,
                'thumbnail'    => $b->thumbnail,
                'tags'         => $b->tags ?? [],
                'published_at' => $b->published_at?->toISOString(),
                'views'        => $b->views,
                'category'     => $b->category ? [
                    'id'    => $b->category->id,
                    'name'  => $b->category->name,
                    'color' => $b->category->color,
                ] : null,
            ]);

        return Inertia::render('Blog/Show', [
            'blog'    => $blog->load('category'),
            'related' => $related,
        ]);
    }
}
