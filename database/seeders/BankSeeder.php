<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('banks')->insert([
            'name' => 'BBVA',
            'transaction_date_field' => 0,
            'value_date_field' => 1,
            'label_field' => 2,
            'amount_field' => 3,
            'balance_field' => 4,
        ]);
    }
}
