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
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ExperienceController as karirController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProjectController as PortoController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BlogController;


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
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

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

    // Profile Management
    Route::get('profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('profile/create', [ProfileController::class, 'create'])->name('profile.create');
    Route::post('profile', [ProfileController::class, 'store'])->name('profile.store');
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');

    // Experience CRUD
    Route::get('experiences',                  [karirController::class, 'index'])->name('experiences.index');
    Route::get('experiences/create',           [karirController::class, 'create'])->name('experiences.create');
    Route::post('experiences',                 [karirController::class, 'store'])->name('experiences.store');
    Route::get('experiences/{experience}/edit', [karirController::class, 'edit'])->name('experiences.edit');
    Route::put('experiences/{experience}',     [karirController::class, 'update'])->name('experiences.update');
    Route::delete('experiences/{experience}',  [karirController::class, 'destroy'])->name('experiences.destroy');
    Route::delete('experiences',               [karirController::class, 'bulkDestroy'])->name('experiences.bulk-destroy');

    // Skill CRUD
    Route::get('skills',                  [SkillController::class, 'index'])->name('skills.index');
    Route::get('skills/create',           [SkillController::class, 'create'])->name('skills.create');
    Route::post('skills',                 [SkillController::class, 'store'])->name('skills.store');
    Route::get('skills/{skill}/edit',     [SkillController::class, 'edit'])->name('skills.edit');
    Route::put('skills/{skill}',          [SkillController::class, 'update'])->name('skills.update');
    Route::delete('skills/{skill}',       [SkillController::class, 'destroy'])->name('skills.destroy');
    Route::delete('skills',               [SkillController::class, 'bulkDestroy'])->name('skills.bulk-destroy');

    Route::resource('messages', MessageController::class)->except(['create', 'store', 'update', 'edit']);
    Route::post('messages/{message}/mark-read', [MessageController::class, 'markAsRead'])->name('messages.mark-read');
    Route::post('messages/{message}/mark-unread', [MessageController::class, 'markAsUnread'])->name('messages.mark-unread');
    Route::post('messages/bulk-mark-read', [MessageController::class, 'bulkMarkAsRead'])->name('messages.bulk-mark-read');
    Route::delete('messages/bulk-destroy', [MessageController::class, 'bulkDestroy'])->name('messages.bulk-destroy');
    Route::post('messages/{message}/restore', [MessageController::class, 'restore'])->name('messages.restore');
    Route::delete('messages/{message}/force', [MessageController::class, 'forceDelete'])->name('messages.force-delete');


    // ─── Project CRUD ─────────────────────────────────────────────────────────────
    Route::get('projects',                   [PortoController::class, 'index'])->name('projects.index');
    Route::get('projects/create',            [PortoController::class, 'create'])->name('projects.create');
    Route::post('projects',                  [PortoController::class, 'store'])->name('projects.store');
    Route::get('projects/{project}/edit',    [PortoController::class, 'edit'])->name('projects.edit');
    Route::put('projects/{project}',         [PortoController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}',      [PortoController::class, 'destroy'])->name('projects.destroy');
    Route::delete('projects',                [PortoController::class, 'bulkDestroy'])->name('projects.bulk-destroy');

    // Upload gambar dari TipTap editor (POST, butuh auth admin)
    Route::post('projects/upload-image',     [PortoController::class, 'uploadImage'])->name('projects.upload-image');

        // ─── Blog CRUD ─────────────────────────────────────────────────────────────
    Route::get('blogs',                   [BlogController::class, 'index'])->name('blogs.index');
    Route::get('blogs/create',            [BlogController::class, 'create'])->name('blogs.create');
    Route::post('blogs',                  [BlogController::class, 'store'])->name('blogs.store');
    Route::get('blogs/{blog}/edit',       [BlogController::class, 'edit'])->name('blogs.edit');
    Route::put('blogs/{blog}',            [BlogController::class, 'update'])->name('blogs.update');
    Route::delete('blogs/{blog}',         [BlogController::class, 'destroy'])->name('blogs.destroy');
    Route::delete('blogs',                [BlogController::class, 'bulkDestroy'])->name('blogs.bulk-destroy');

    // Upload gambar dari TipTap editor
    Route::post('blogs/upload-image',     [BlogController::class, 'uploadImage'])->name('blogs.upload-image');
});
