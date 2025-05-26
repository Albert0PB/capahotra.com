<?php

namespace Database\Factories;

use App\Models\Bank;
use Illuminate\Database\Eloquent\Factories\Factory;

class BankFactory extends Factory
{
    protected $model = Bank::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company . ' Bank',
            'transaction_date_field' => $this->faker->numberBetween(0, 20),
            'value_date_field' => $this->faker->numberBetween(0, 20),
            'label_field' => $this->faker->numberBetween(0, 20),
            'amount_field' => $this->faker->numberBetween(0, 20),
            'balance_field' => $this->faker->numberBetween(0, 20),
        ];
    }
}
