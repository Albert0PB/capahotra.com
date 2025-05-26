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
        // Asegurarse que haya al menos un usuario
        $user = User::first() ?? User::factory()->create();

        // Último movimiento para calcular balance anterior
        $lastMovement = Movement::where('user_id', $user->id)->latest()->first();
        $previousBalance = $lastMovement ? $lastMovement->balance : 0;

        // Determinar tipo ingreso o gasto
        if ($previousBalance < 500) {
            $isIncome = $this->faker->boolean(80);
        } else {
            $isIncome = $this->faker->boolean(50);
        }

        // Obtener el tipo de movimiento según el código
        $movementType = MovementType::where('code', $isIncome ? 'I' : 'E')->first();
        if (!$movementType) {
            $movementType = MovementType::factory()->create(['code' => $isIncome ? 'I' : 'E']);
        }

        // Calcular el monto según sea ingreso o gasto
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

        // Calcular balance actual
        $actualBalance = $isIncome ? $previousBalance + $amount : $previousBalance - $amount;

        // Asegurar que existan bancos
        $bank = Bank::first() ?? Bank::factory()->create();

        // Asegurar que exista alguna etiqueta para ese usuario
        $label = Label::where('user_id', $user->id)->first();
        if (!$label) {
            $label = Label::factory()->create(['user_id' => $user->id]);
        }

        $transactionDate = $this->faker->dateTimeBetween('2025-01-01', '2025-12-31');
        $valueDate = $transactionDate;

        return [
            'movement_type_id' => $movementType->id,
            'user_id' => $user->id,
            'bank_id' => $bank->id,
            'label_id' => $label->id,
            'transaction_date' => $transactionDate,
            'value_date' => $valueDate,
            'comment' => $this->faker->sentence(),
            'amount' => $amount,
            'balance' => $actualBalance,
        ];
    }


}
