<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Profile;
use App\Models\Experience;
use App\Models\Education;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('About', [
            'profile'     => Profile::first(),
            'experiences' => Experience::orderBy('order', 'asc')->get(),
            'educations'  => Education::orderBy('order', 'asc')->get(), // 👈 Tambahkan data education
        ]);
    }
}
