<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique(); // SEO-friendly URL
            $table->string('excerpt', 500)->nullable(); // Ringkasan singkat
            $table->longText('content')->nullable(); // HTML dari TipTap
            $table->string('thumbnail')->nullable();
            $table->string('meta_title', 255)->nullable(); // SEO
            $table->string('meta_description', 500)->nullable(); // SEO
            $table->json('tags')->nullable(); // Array tags
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->unsignedInteger('views')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};