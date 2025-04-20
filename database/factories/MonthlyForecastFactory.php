<?php
namespace Database\Factories;
use App\Models\Label;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MonthlyForecast>
 */
class MonthlyForecastFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $usedCombinations = [];
        
        $users = User::all();
        $labels = Label::all();
        
        do {
            $user_id = $users->random()->id;
            $label_id = $labels->random()->id;
            $year = 2025;
            $month = $this->faker->numberBetween(0, 11);
            
            $combinationKey = "{$label_id}_{$user_id}_{$month}_{$year}";
            
        } while (in_array($combinationKey, $usedCombinations));
        
        $usedCombinations[] = $combinationKey;
        
        return [
            'label_id' => $label_id,
            'user_id' => $user_id,
            'year' => $year,
            'month' => $month,
            'amount' => $this->faker->randomFloat(2, 100, 2500),
            'comment' => $this->faker->sentence()
        ];
    }
}