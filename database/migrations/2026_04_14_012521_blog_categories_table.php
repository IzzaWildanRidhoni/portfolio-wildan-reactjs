<?php
// database/migrations/xxxx_create_blog_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('color', 20)->default('#6366f1'); // warna badge
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });

        // Tambah kolom category_id ke blogs
        Schema::table('blogs', function (Blueprint $table) {
            $table->foreignId('blog_category_id')
                ->nullable()
                ->constrained('blog_categories')
                ->nullOnDelete()
                ->after('slug');
        });
    }

    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\BlogCategory::class);
            $table->dropColumn('blog_category_id');
        });
        Schema::dropIfExists('blog_categories');
    }
};
