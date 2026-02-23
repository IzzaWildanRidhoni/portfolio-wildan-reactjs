<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company');
            $table->string('logo')->nullable();
            $table->string('location');
            $table->string('start_date');
            $table->string('end_date')->nullable();
            $table->string('duration')->nullable();
            $table->string('type'); // Internship, Part-time, Full-time
            $table->string('work_mode'); // Remote, Hybrid, Onsite
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
