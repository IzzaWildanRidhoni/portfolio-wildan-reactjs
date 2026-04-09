<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AchievementController as pencapaianController;
use App\Http\Controllers\Admin\EducationController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', [AboutController::class, 'index'])->name('about');
Route::get('/proyek', [ProjectController::class, 'index'])->name('projects');
Route::get('/proyek/{project}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/pencapaian', [AchievementController::class, 'index'])->name('achievements');
Route::get('/statistik', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/kontak', [ContactController::class, 'index'])->name('contact');
Route::post('/kontak', [ContactController::class, 'store'])->name('contact.store');



// Auth routes (tanpa middleware)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login',  [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login'])->name('login.post');
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');
});

// Protected admin routes
Route::prefix('admin')->name('admin.')->middleware('admin.auth')->group(function () {
    Route::get('/', fn() => redirect()->route('admin.achievements.index'))->name('dashboard');

    // Achievement CRUD
    Route::get('achievements',                  [pencapaianController::class, 'index'])->name('achievements.index');
    Route::get('achievements/create',           [pencapaianController::class, 'create'])->name('achievements.create');
    Route::post('achievements',                 [pencapaianController::class, 'store'])->name('achievements.store');
    Route::get('achievements/{achievement}/edit', [pencapaianController::class, 'edit'])->name('achievements.edit');
    Route::put('achievements/{achievement}',    [pencapaianController::class, 'update'])->name('achievements.update');
    Route::delete('achievements/{achievement}', [pencapaianController::class, 'destroy'])->name('achievements.destroy');
    Route::delete('achievements',               [pencapaianController::class, 'bulkDestroy'])->name('achievements.bulk-destroy');

    // Education CRUD
    Route::get('educations',                  [EducationController::class, 'index'])->name('educations.index');
    Route::get('educations/create',           [EducationController::class, 'create'])->name('educations.create');
    Route::post('educations',                 [EducationController::class, 'store'])->name('educations.store');
    Route::get('educations/{education}/edit', [EducationController::class, 'edit'])->name('educations.edit');
    Route::put('educations/{education}',      [EducationController::class, 'update'])->name('educations.update');
    Route::delete('educations/{education}',   [EducationController::class, 'destroy'])->name('educations.destroy');
    Route::delete('educations',               [EducationController::class, 'bulkDestroy'])->name('educations.bulk-destroy');
});
