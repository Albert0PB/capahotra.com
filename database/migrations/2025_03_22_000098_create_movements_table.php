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
        Schema::create('movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movement_type_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('bank_id')->constrained();
            $table->foreignId('label_id')->constrained();
            $table->date('transaction_date');
            $table->date('value_date');
            $table->string('comment', 255);
            $table->decimal('amount', 8, 2);
            $table->decimal('balance', 18, 2);
            $table->timestamps();
            $table->index('user_id');
            $table->index(['user_id', 'label_id', 'transaction_date']);
            $table->index(['user_id', 'movement_type_id', 'transaction_date']);
        });
        DB::statement('ALTER TABLE movements ADD CONSTRAINT check_dates_order CHECK (value_date >= transaction_date)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movements');
    }
};
