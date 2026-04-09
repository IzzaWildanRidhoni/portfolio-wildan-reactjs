<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('logo')->nullable();
            $table->string('degree');
            $table->string('field');
            $table->string('gpa')->nullable();
            $table->string('start_year');
            $table->string('end_year');
            $table->string('location');
            $table->enum('level', ['SMA', 'SMK', 'D3', 'S1', 'S2', 'S3', 'Professional', 'Certification']);
            $table->text('description')->nullable();
            $table->unsignedInteger('order')->default(0); // Opsional: untuk sorting
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('educations');
    }
};
