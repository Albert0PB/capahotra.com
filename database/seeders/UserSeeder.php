<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(10)->create();

        User::create([
            'name' => 'Alberto PB',
            'email' => 'a23pebeal@iesgrancapitan.org',
            'password' => Hash::make('usuario'),
            'email_verified_at' => now(),
            'remember_token' => null,
        ]);
    }
}
