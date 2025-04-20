<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('monthly_forecasts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('label_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->smallInteger('year', false, true);
            $table->smallInteger('month', false, true);
            $table->decimal('amount', 8, 2);
            $table->string('comment', 255);
            $table->timestamps();
            $table->unique(['label_id', 'user_id', 'month', 'year'], 'unique_forecast_per_label_month_year');
            $table->index('user_id');
            $table->index(['user_id', 'year', 'month']);
            $table->index(['user_id', 'label_id']);
            $table->index(['user_id', 'label_id', 'year', 'month']);
        });
        DB::statement('ALTER TABLE monthly_forecasts ADD CONSTRAINT check_month_number CHECK (0 <= month AND month <= 11)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_forecasts');
    }
};
