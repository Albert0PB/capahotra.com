<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(MovementTypeSeeder::class);
        $this->call(LabelSeeder::class);
        $this->call(MonthlyForecastSeeder::class);
        $this->call(BankSeeder::class);
        $this->call(MovementSeeder::class);
    }
}
