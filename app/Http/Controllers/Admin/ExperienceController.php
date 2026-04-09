<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    public function index()
    {
        // Client-side handles filtering, sorting, pagination
        $experiences = Experience::orderBy('order', 'asc')->orderBy('start_date', 'desc')->get();

        return Inertia::render('Admin/Experiences/Index', [
            'experiences' => $experiences,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Experiences/Form', [
            'experience' => null,
            'mode'       => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'company'      => 'required|string|max:255',
            'logo'         => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'location'     => 'required|string|max:255',
            'start_date'   => 'required|string|max:10',
            'end_date'     => 'nullable|string|max:10',
            'duration'     => 'nullable|string|max:50',
            'type'         => 'required|in:Full-time,Part-time,Contract,Internship,Freelance,Remote',
            'work_mode'    => 'required|in:On-site,Hybrid,Remote',
            'description'  => 'nullable|string|max:2000',
            'order'        => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('experiences', 'public');
            $validated['logo'] = '/storage/' . $validated['logo'];
        }

        Experience::create($validated);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience berhasil ditambahkan.');
    }

    public function edit(Experience $experience)
    {
        return Inertia::render('Admin/Experiences/Form', [
            'experience' => $experience,
            'mode'       => 'edit',
        ]);
    }

    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'company'      => 'required|string|max:255',
            'logo'         => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'location'     => 'required|string|max:255',
            'start_date'   => 'required|string|max:10',
            'end_date'     => 'nullable|string|max:10',
            'duration'     => 'nullable|string|max:50',
            'type'         => 'required|in:Full-time,Part-time,Contract,Internship,Freelance,Remote',
            'work_mode'    => 'required|in:On-site,Hybrid,Remote',
            'description'  => 'nullable|string|max:2000',
            'order'        => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('logo')) {
            if ($experience->logo && str_starts_with($experience->logo, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $experience->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['logo'] = '/storage/' . $request->file('logo')->store('experiences', 'public');
        } else {
            unset($validated['logo']);
        }

        $experience->update($validated);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience berhasil diperbarui.');
    }

    public function destroy(Experience $experience)
    {
        if ($experience->logo && str_starts_with($experience->logo, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $experience->logo);
            Storage::disk('public')->delete($oldPath);
        }

        $experience->delete();

        return back()->with('success', 'Experience berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:experiences,id',
        ]);

        $experiences = Experience::whereIn('id', $request->ids)->get();

        foreach ($experiences as $experience) {
            if ($experience->logo && str_starts_with($experience->logo, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $experience->logo);
                Storage::disk('public')->delete($oldPath);
            }
        }

        Experience::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' experience berhasil dihapus.');
    }
}
