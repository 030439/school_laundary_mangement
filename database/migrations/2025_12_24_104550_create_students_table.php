<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('studentId')->unique();
        $table->string('name');
        $table->string('class');
        $table->string('section')->nullable();
        $table->string('parentName');
        $table->decimal('monthlyPocketMoney', 10, 2)->default(0);
        $table->enum('status', ['active', 'inactive'])->default('active');
        $table->timestamps();
        });
   }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
