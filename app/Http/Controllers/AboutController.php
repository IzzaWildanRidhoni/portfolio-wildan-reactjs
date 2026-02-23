<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Profile;
use App\Models\Experience;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('About', [
            'profile' => Profile::first(),
            'experiences' => Experience::orderBy('order')->get(),
        ]);
    }
}
