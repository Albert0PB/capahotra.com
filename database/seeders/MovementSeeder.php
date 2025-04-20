<?php

namespace Database\Seeders;

use App\Models\Movement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Movement::factory()->count(200)->create();
    }
}
