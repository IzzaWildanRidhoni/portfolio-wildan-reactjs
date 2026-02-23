<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Message;
use App\Models\Profile;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact', [
            'profile' => Profile::first(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);
        Message::create($validated);
        return back()->with('success', 'Pesan berhasil dikirim!');
    }
}
