<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username');
            $table->string('title');
            $table->string('location');
            $table->string('work_type')->default('Onsite');
            $table->text('bio');
            $table->string('avatar')->nullable();
            $table->string('email')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('github')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('instagram')->nullable();
            $table->string('tiktok')->nullable();
            $table->boolean('is_verified')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
