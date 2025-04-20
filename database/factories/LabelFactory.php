<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Label;

class LabelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $usedCombinations = [];
        $availableNames = ['Ocio', 'Comidas', 'Bizum', 'Nómina', 'Alquiler', 'Compras', 'Seguros'];

        do
        {
            $user = User::all()->random();
            $user_id = $user->id;
            $name = $this->faker->randomElement($availableNames);
            $combinationKey = "{$user_id}_{$name}";
        } while( in_array($combinationKey, $usedCombinations) );

        $usedCombinations[] = $combinationKey;

        return [
            'user_id' => $user->id,
            'name' => $name
        ];
    }
}