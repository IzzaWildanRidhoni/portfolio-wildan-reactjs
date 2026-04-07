<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Message;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        // Ambil social links aktif, format untuk frontend
        $socialLinks = SocialLink::active()
            ->get()
            ->map(fn($link) => $link->toFrontendFormat())
            ->values()
            ->all();

        return Inertia::render('Contact', [
            'socialLinks' => $socialLinks,
            'success' => session('success'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10',
        ]);

        Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', 'Pesan berhasil dikirim! Saya akan membalas secepatnya.');
    }
}
