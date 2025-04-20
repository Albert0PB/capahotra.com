<?php
namespace Database\Factories;
use App\Models\Bank;
use App\Models\Label;
use App\Models\MovementType;
use App\Models\User;
use App\Models\Movement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Movement>
 */
class MovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::all()->random();
        $lastMovement = Movement::where('user_id', $user->id)->latest()->first();
        $previousBalance = $lastMovement ? $lastMovement->balance : 0;
        
        if ($previousBalance < 500) {
            $isIncome = $this->faker->boolean(80);
        } else {
            $isIncome = $this->faker->boolean(50);
        }
        
        $movementType = MovementType::where('code', $isIncome ? 'I' : 'E')->first();
        
        if (!$isIncome) {
            $maxAmount = min($previousBalance, 2500);
            
            if ($maxAmount < 100) {
                $amount = $this->faker->randomFloat(2, 1, $maxAmount ?: 1);
            } else {
                $amount = $this->faker->randomFloat(2, 100, $maxAmount);
            }
        } else {
            $amount = $this->faker->randomFloat(2, 100, 2500);
        }
        
        $actualBalance = $isIncome ? $previousBalance + $amount : $previousBalance - $amount;
        $date = $this->faker->dateTimeThisYear('+8 months', 'Europe/Madrid');
        
        return [
            'movement_type_id' => $movementType->id,
            'user_id' => $user->id,
            'bank_id' => Bank::all()->random()->id,
            'label_id' => Label::where('user_id', $user->id)->get()->random()->id,
            'transaction_date' => $date,
            'value_date' => $date,
            'comment' => $this->faker->sentence(),
            'amount' => $amount,
            'balance' => $actualBalance
        ];
    }
}