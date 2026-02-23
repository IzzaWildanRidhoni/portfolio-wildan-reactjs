<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Profile;
use App\Models\Skill;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'profile' => Profile::first(),
            'skills' => Skill::orderBy('order')->get(),
        ]);
    }
}
