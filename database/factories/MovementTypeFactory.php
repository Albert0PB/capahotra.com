<?php

namespace Database\Factories;

use App\Models\MovementType;
use Illuminate\Database\Eloquent\Factories\Factory;

class MovementTypeFactory extends Factory
{
    protected $model = MovementType::class;

    public function definition()
    {
        return [
            'code' => $this->faker->randomElement(['I', 'E']),
        ];
    }
}
