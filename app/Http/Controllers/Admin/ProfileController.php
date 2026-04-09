<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = Profile::first();

        return Inertia::render('Admin/Profile/Index', [
            'profile' => $profile,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Profile/Form', [
            'profile' => null,
            'mode' => 'create',
        ]);
    }

    public function edit()
    {
        $profile = Profile::first();

        return Inertia::render('Admin/Profile/Form', [
            'profile' => $profile,
            'mode' => 'edit',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'username'      => 'required|string|max:100|unique:profiles,username',
            'title'         => 'nullable|string|max:255',
            'location'      => 'nullable|string|max:255',
            'work_type'     => 'nullable|string|max:100',
            'bio'           => 'nullable|string|max:1000',
            'email'         => 'nullable|email|max:255',
            'whatsapp'      => 'nullable|string|max:50',
            'github'        => 'nullable|url|max:255',
            'linkedin'      => 'nullable|url|max:255',
            'instagram'     => 'nullable|url|max:255',
            'tiktok'        => 'nullable|url|max:255',
            'avatar'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_verified'   => 'nullable|boolean',
        ]);

        // Handle avatar upload for CREATE
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = '/storage/' . $path; // Store relative path for consistency
        }

        Profile::create($validated);

        return redirect()->to('/admin/profile')->with('success', 'Profile berhasil dibuat.');
    }

    public function update(Request $request)
    {
        $profile = Profile::first();

        if (!$profile) {
            return redirect()->to('/admin/profile/create')->with('error', 'Profile tidak ditemukan.');
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'username'      => 'required|string|max:100|unique:profiles,username,' . $profile->id,
            'title'         => 'nullable|string|max:255',
            'location'      => 'nullable|string|max:255',
            'work_type'     => 'nullable|string|max:100',
            'bio'           => 'nullable|string|max:1000',
            'email'         => 'nullable|email|max:255',
            'whatsapp'      => 'nullable|string|max:50',
            'github'        => 'nullable|url|max:255',
            'linkedin'      => 'nullable|url|max:255',
            'instagram'     => 'nullable|url|max:255',
            'tiktok'        => 'nullable|url|max:255',
            'avatar'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_verified'   => 'nullable|boolean',
        ]);

        // ✅ FIX: Handle avatar upload with proper deletion logic
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($profile->avatar) {
                $this->deleteAvatarFile($profile->avatar);
            }

            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = '/storage/' . $path;
        } else {
            // ✅ IMPORTANT: Remove avatar from validated data if no new file
            // This prevents overwriting existing avatar with null
            unset($validated['avatar']);
        }

        $profile->update($validated);

        return redirect()->to('/admin/profile')->with('success', 'Profile berhasil diperbarui.');
    }

    /**
     * Helper: Delete avatar file from storage
     * Handles both relative paths and full URLs
     */
    private function deleteAvatarFile($avatarPath)
    {
        if (!$avatarPath) {
            return;
        }

        // Convert full URL to relative path if needed
        // Example: "http://localhost/storage/avatars/xxx.jpg" → "avatars/xxx.jpg"
        // Example: "/storage/avatars/xxx.jpg" → "avatars/xxx.jpg"
        $relativePath = $avatarPath;

        // Remove domain/protocol if it's a full URL
        if (Str::startsWith($avatarPath, ['http://', 'https://'])) {
            $parsed = parse_url($avatarPath);
            $relativePath = $parsed['path'] ?? $avatarPath;
        }

        // Remove "/storage/" prefix to get the path relative to storage/app/public
        if (Str::startsWith($relativePath, '/storage/')) {
            $relativePath = Str::replaceFirst('/storage/', '', $relativePath);
        }

        // Delete file if it exists in storage
        if ($relativePath && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
