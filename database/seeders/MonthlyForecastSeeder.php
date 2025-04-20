<?php

namespace Database\Seeders;

use App\Models\MonthlyForecast;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MonthlyForecastSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MonthlyForecast::factory()->count(96)->create();
    }
}
