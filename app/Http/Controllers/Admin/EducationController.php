<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EducationController extends Controller
{
    public function index()
    {
        // Ambil semua data, urutkan berdasarkan start_year desc (default)
        // Client yang akan handle filter, search, sort, dan pagination
        $educations = Education::orderBy('start_year', 'desc')->get();

        return Inertia::render('Admin/Educations/Index', [
            'educations' => $educations, // Array collection, bukan paginator
        ]);
    }
    public function create()
    {
        return Inertia::render('Admin/Educations/Form', [
            'education' => null,
            'mode'      => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'logo'        => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'degree'      => 'required|string|max:255',
            'field'       => 'required|string|max:255',
            'gpa'         => 'nullable|string|max:10',
            'start_year'  => 'required|string|max:10',
            'end_year'    => 'nullable|string|max:10',
            'location'    => 'required|string|max:255',
            'level'       => 'required|in:SMA,SMK,D3,S1,S2,S3,Professional,Certification',
            'description' => 'nullable|string|max:1000',
            'order'       => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('educations', 'public');
            $validated['logo'] = '/storage/' . $validated['logo'];
        }

        Education::create($validated);

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education berhasil ditambahkan.');
    }

    public function edit(Education $education)
    {
        return Inertia::render('Admin/Educations/Form', [
            'education' => $education,
            'mode'      => 'edit',
        ]);
    }

    public function update(Request $request, Education $education)
    {
        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'logo'        => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'degree'      => 'required|string|max:255',
            'field'       => 'required|string|max:255',
            'gpa'         => 'nullable|string|max:10',
            'start_year'  => 'required|string|max:10',
            'end_year'    => 'nullable|string|max:10',
            'location'    => 'required|string|max:255',
            'level'       => 'required|in:SMA,SMK,D3,S1,S2,S3,Professional,Certification',
            'description' => 'nullable|string|max:1000',
            'order'       => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($education->logo && str_starts_with($education->logo, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $education->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['logo'] = '/storage/' . $request->file('logo')->store('educations', 'public');
        } else {
            unset($validated['logo']);
        }

        $education->update($validated);

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education berhasil diperbarui.');
    }

    public function destroy(Education $education)
    {
        if ($education->logo && str_starts_with($education->logo, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $education->logo);
            Storage::disk('public')->delete($oldPath);
        }

        $education->delete();

        return back()->with('success', 'Education berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:educations,id',
        ]);

        $educations = Education::whereIn('id', $request->ids)->get();

        foreach ($educations as $education) {
            if ($education->logo && str_starts_with($education->logo, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $education->logo);
                Storage::disk('public')->delete($oldPath);
            }
        }

        Education::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' education berhasil dihapus.');
    }
}
