<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('issuer');
            $table->string('credential_id')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('issued_date');
            $table->string('type'); // Certificate, Badge, Award
            $table->string('category'); // Backend, Frontend, Mobile
            $table->string('credential_url')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
