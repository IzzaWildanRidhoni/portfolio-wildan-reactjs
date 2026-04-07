<?php
// database/migrations/xxxx_xx_xx_create_social_links_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // email, instagram, linkedin, github, tiktok, whatsapp
            $table->string('label')->nullable(); // "Ikuti Perjalanan Saya"
            $table->string('description')->nullable();
            $table->string('url'); // https://instagram.com/username atau mailto:xxx
            $table->string('icon_class')->nullable(); // untuk custom icon
            $table->string('gradient')->nullable(); // CSS gradient
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_full_width')->default(false); // untuk card layout
            $table->string('button_text')->nullable(); // "Pergi ke Instagram"
            $table->timestamps();

            $table->index('platform');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_links');
    }
};
