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
        $availableNames = [
            'Ocio', 'Comidas', 'Bizum', 'Nómina', 'Alquiler', 'Compras', 'Seguros',
            'Transporte', 'Salud', 'Educación', 'Tecnología', 'Ropa', 'Hogar',
            'Viajes', 'Gimnasio', 'Mascotas', 'Regalos', 'Servicios', 'Impuestos',
            'Ahorros', 'Inversiones', 'Gasolina', 'Restaurantes', 'Supermercado',
            'Farmacia', 'Subscripciones', 'Entretenimiento', 'Deportes', 'Libros',
            'Música', 'Cine', 'Teatro', 'Arte', 'Jardinería', 'Bricolaje'
        ];

        // Esta función se ejecutará cada vez que se cree un modelo
        return [
            'user_id' => function() {
                return User::inRandomOrder()->first()?->id ?? User::factory()->create()->id;
            },
            'name' => function(array $attributes) use ($availableNames) {
                $userId = $attributes['user_id'];
                
                // Buscar un nombre único para este usuario
                return $this->findUniqueNameForUser($userId, $availableNames);
            },
        ];
    }

    /**
     * Encuentra un nombre único para el usuario específico
     */
    private function findUniqueNameForUser(int $userId, array $availableNames): string
    {
        // Obtener nombres ya usados por este usuario
        $usedNames = Label::where('user_id', $userId)->pluck('name')->toArray();
        
        // Filtrar nombres disponibles
        $availableNamesForUser = array_diff($availableNames, $usedNames);
        
        // Si hay nombres predefinidos disponibles, usar uno aleatorio
        if (!empty($availableNamesForUser)) {
            return $this->faker->randomElement($availableNamesForUser);
        }
        
        // Si no hay nombres predefinidos, generar uno único
        return $this->generateUniqueRandomName($userId);
    }

    /**
     * Genera un nombre aleatorio único para el usuario
     */
    private function generateUniqueRandomName(int $userId): string
    {
        $maxAttempts = 50;
        $attempt = 0;
        
        do {
            $name = ucfirst($this->faker->word()) . '_' . $this->faker->numberBetween(100, 999);
            
            $exists = Label::where('user_id', $userId)
                          ->where('name', $name)
                          ->exists();
            
            $attempt++;
            
        } while ($exists && $attempt < $maxAttempts);
        
        // Fallback final con timestamp
        if ($exists) {
            $name = 'Label_' . now()->format('YmdHis') . '_' . $this->faker->randomNumber(3);
        }
        
        return $name;
    }

    /**
     * Estado para crear labels para un usuario específico
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}