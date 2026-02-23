<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContactController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', [AboutController::class, 'index'])->name('about');
Route::get('/proyek', [ProjectController::class, 'index'])->name('projects');
Route::get('/proyek/{project}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/pencapaian', [AchievementController::class, 'index'])->name('achievements');
Route::get('/dasbor', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/kontak', [ContactController::class, 'index'])->name('contact');
Route::post('/kontak', [ContactController::class, 'store'])->name('contact.store');
