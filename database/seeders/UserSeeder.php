<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(10)->create();
        
        DB::table('users')->insert([
            'login' => 'Alberto PB',
            'email' => 'a23pebeal@iesgrancapitan.org',
            'password_hash' => Hash::make('usuario'),
            'active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
