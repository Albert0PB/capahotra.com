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
        $availableNames = ['Ocio', 'Comidas', 'Bizum', 'Nómina', 'Alquiler', 'Compras', 'Seguros'];

        $user = User::first() ?? User::factory()->create();

        // Obtener los nombres que ese usuario ya tiene
        $usedNames = Label::where('user_id', $user->id)->pluck('name')->all();
        $namesLeft = array_diff($availableNames, $usedNames);

        if (empty($namesLeft)) {
            // Si ya no quedan nombres únicos, crea un nombre aleatorio
            $name = $this->faker->unique()->word;
        } else {
            $name = $this->faker->randomElement($namesLeft);
        }

        return [
            'user_id' => $user->id,
            'name' => $name,
        ];
    }

}