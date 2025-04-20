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
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('name', 70)->unique();
            $table->integer('transaction_date_field', false, true);
            $table->integer('value_date_field', false, true);
            $table->integer('label_field', false, true);
            $table->integer('amount_field', false, true);
            $table->integer('balance_field', false, true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banks');
    }
};
