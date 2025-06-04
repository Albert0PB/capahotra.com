<?php

namespace Database\Seeders;

use App\Models\Label;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (User::count() < 5) {
            User::factory()->count(5)->create();
        }

        for ($i = 0; $i < 55; $i++) {
            Label::factory()->create();
        }
    }
}