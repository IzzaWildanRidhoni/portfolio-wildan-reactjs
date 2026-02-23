<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        $query = Achievement::query();

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%")
                ->orWhere('issuer', 'like', "%{$request->search}%");
        }
        if ($request->type) $query->where('type', $request->type);
        if ($request->category) $query->where('category', $request->category);

        return Inertia::render('Achievements', [
            'achievements' => $query->latest()->get(),
            'filters' => $request->only(['search', 'type', 'category']),
        ]);
    }
}
