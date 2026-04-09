<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Profile;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ✅ Share profile data ke SEMUA halaman Inertia
        Inertia::share([
            'globalProfile' => function () {
                return Profile::select('name', 'username', 'avatar', 'is_verified')->first();
            },
        ]);
    }
}
