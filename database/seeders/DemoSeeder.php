<?php
// php artisan db:seed --class=DemoSeeder

namespace Database\Seeders;

use App\Models\User;
use App\Models\Bank;
use App\Models\MovementType;
use App\Models\Label;
use App\Models\MonthlyForecast;
use App\Models\Movement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DemoSeeder extends Seeder
{
    private User $demoUser;
    private Bank $demoBank;
    private array $movementTypes = [];
    private array $labels = [];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->createDemoUser();
            $this->createDemoBank();
            $this->createMovementTypes();
            $this->createLabels();
            $this->createMonthlyForecasts();
            $this->createMovements();
        });

        $this->command->info("Demo data created successfully!");
        $this->command->info("User: {$this->demoUser->name} ({$this->demoUser->email})");
        $this->command->info("Bank: {$this->demoBank->name}");
        $this->command->info("Labels: " . count($this->labels));
        $this->command->info("Monthly Forecasts: " . MonthlyForecast::where('user_id', $this->demoUser->id)->count());
        $this->command->info("Movements: " . Movement::where('user_id', $this->demoUser->id)->count());
    }

    /**
     * Crear el usuario demo
     */
    private function createDemoUser(): void
    {
        $this->demoUser = User::create([
            'name' => 'Alberto PB',
            'email' => 'a23pebeal@iesgrancapitan.org',
            'password' => Hash::make('usuario'),
            'email_verified_at' => now(),
            'remember_token' => null,
        ]);

        $this->command->info("Created demo user: {$this->demoUser->name}");
    }

    /**
     * Crear el banco demo
     */
    private function createDemoBank(): void
    {
        $this->demoBank = Bank::create([
            'name' => 'BBVA',
            'transaction_date_field' => 0,
            'value_date_field' => 1,
            'label_field' => 2,
            'amount_field' => 3,
            'balance_field' => 4,
        ]);

        $this->command->info("Created demo bank: {$this->demoBank->name}");
    }

    /**
     * Crear los tipos de movimiento
     */
    private function createMovementTypes(): void
    {
        $types = [
            ['code' => 'I'], // Ingreso
            ['code' => 'E'], // Egreso/Gasto
            ['code' => 'C'], // Corrección
        ];

        foreach ($types as $type) {
            $this->movementTypes[] = MovementType::create($type);
        }

        $this->command->info("Created movement types: I, E, C");
    }

    /**
     * Crear las etiquetas para el usuario demo
     */
    private function createLabels(): void
    {
        $labelNames = [
            'Nómina', 'Alquiler', 'Supermercado', 'Gasolina', 'Seguros',
            'Ocio', 'Restaurantes', 'Ropa', 'Salud', 'Transporte',
            'Bizum', 'Gimnasio', 'Subscripciones', 'Tecnología', 'Hogar',
            'Viajes', 'Educación', 'Mascotas', 'Regalos', 'Farmacia',
            'Servicios', 'Impuestos', 'Ahorros', 'Inversiones', 'Entretenimiento',
            'Deportes', 'Libros', 'Música', 'Cine', 'Teatro',
            'Arte', 'Jardinería', 'Bricolaje', 'Compras_Online', 'Delivery',
            'Parking', 'Peluquería', 'Limpieza', 'Reparaciones', 'Decoración'
        ];

        foreach ($labelNames as $name) {
            $this->labels[] = Label::create([
                'user_id' => $this->demoUser->id,
                'name' => $name,
            ]);
        }

        $this->command->info("Created " . count($this->labels) . " labels for demo user");
    }

    /**
     * Crear previsiones mensuales para el usuario demo
     */
    private function createMonthlyForecasts(): void
    {
        $months = range(0, 11); // 12 meses (0-11)
        $year = 2025;
        
        // Crear previsiones para aproximadamente el 60% de las etiquetas en cada mes
        foreach ($months as $month) {
            // Seleccionar etiquetas aleatorias para este mes
            $selectedLabels = collect($this->labels)->random(rand(15, 25));
            
            foreach ($selectedLabels as $label) {
                MonthlyForecast::create([
                    'label_id' => $label->id,
                    'user_id' => $this->demoUser->id,
                    'year' => $year,
                    'month' => $month,
                    'amount' => $this->generateForecastAmount($label->name),
                    'comment' => $this->generateForecastComment($label->name, $month),
                ]);
            }
        }

        $forecastCount = MonthlyForecast::where('user_id', $this->demoUser->id)->count();
        $this->command->info("Created {$forecastCount} monthly forecasts for demo user");
    }

    /**
     * Crear movimientos para el usuario demo
     */
    private function createMovements(): void
    {
        $currentBalance = 5000.00; // Balance inicial
        $movementsData = [];
        
        // Crear movimientos distribuidos a lo largo del año
        for ($i = 0; $i < 500; $i++) {
            // Determinar tipo de movimiento (80% gastos, 15% ingresos, 5% correcciones)
            $rand = rand(1, 100);
            if ($rand <= 15) {
                $movementType = collect($this->movementTypes)->where('code', 'I')->first();
                $isIncome = true;
            } elseif ($rand <= 95) {
                $movementType = collect($this->movementTypes)->where('code', 'E')->first();
                $isIncome = false;
            } else {
                $movementType = collect($this->movementTypes)->where('code', 'C')->first();
                $isIncome = rand(0, 1) === 1;
            }

            // Generar monto según el tipo
            if ($isIncome) {
                $amount = $this->generateIncomeAmount();
            } else {
                $amount = $this->generateExpenseAmount($currentBalance);
            }

            // Calcular nuevo balance
            $currentBalance = $isIncome ? $currentBalance + $amount : $currentBalance - $amount;
            
            // Evitar balances negativos muy extremos
            if ($currentBalance < -1000) {
                $currentBalance += 2000; // Inyectar dinero
            }

            // Seleccionar etiqueta apropiada según el tipo de movimiento
            $label = $this->selectAppropriateLabel($isIncome, $amount);
            
            // Generar fechas
            $transactionDate = fake()->dateTimeBetween('2025-01-01', '2025-12-31');
            $valueDate = $transactionDate;

            $movementsData[] = [
                'movement_type_id' => $movementType->id,
                'user_id' => $this->demoUser->id,
                'bank_id' => $this->demoBank->id,
                'label_id' => $label->id,
                'transaction_date' => $transactionDate->format('Y-m-d'),
                'value_date' => $valueDate->format('Y-m-d'),
                'comment' => $this->generateMovementComment($label->name, $isIncome),
                'amount' => round($amount, 2),
                'balance' => round($currentBalance, 2),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insertar en lotes para mejor rendimiento
        $chunks = array_chunk($movementsData, 50);
        foreach ($chunks as $chunk) {
            Movement::insert($chunk);
        }

        $this->command->info("Created 500 movements for demo user");
    }

    /**
     * Generar monto de previsión según la etiqueta
     */
    private function generateForecastAmount(string $labelName): float
    {
        return match(true) {
            str_contains(strtolower($labelName), 'nómina') => fake()->randomFloat(2, 2000, 3500),
            str_contains(strtolower($labelName), 'alquiler') => fake()->randomFloat(2, 800, 1200),
            str_contains(strtolower($labelName), 'supermercado') => fake()->randomFloat(2, 300, 500),
            str_contains(strtolower($labelName), 'gasolina') => fake()->randomFloat(2, 150, 250),
            str_contains(strtolower($labelName), 'seguros') => fake()->randomFloat(2, 100, 300),
            default => fake()->randomFloat(2, 50, 400)
        };
    }

    /**
     * Generar comentario de previsión
     */
    private function generateForecastComment(string $labelName, int $month): string
    {
        $monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        return "Previsión {$labelName} para " . $monthNames[$month];
    }

    /**
     * Generar monto de ingreso
     */
    private function generateIncomeAmount(): float
    {
        $rand = rand(1, 100);
        if ($rand <= 60) {
            // Nómina o ingresos regulares
            return fake()->randomFloat(2, 2000, 3500);
        } elseif ($rand <= 85) {
            // Ingresos extras, freelance
            return fake()->randomFloat(2, 200, 800);
        } else {
            // Ingresos ocasionales
            return fake()->randomFloat(2, 50, 300);
        }
    }

    /**
     * Generar monto de gasto
     */
    private function generateExpenseAmount(float $currentBalance): float
    {
        $maxAmount = min($currentBalance + 500, 2000); // Permitir cierto sobregiro
        
        $rand = rand(1, 100);
        if ($rand <= 40) {
            // Gastos pequeños
            return fake()->randomFloat(2, 5, 50);
        } elseif ($rand <= 75) {
            // Gastos medianos
            return fake()->randomFloat(2, 50, 200);
        } elseif ($rand <= 90) {
            // Gastos grandes
            return fake()->randomFloat(2, 200, min($maxAmount, 800));
        } else {
            // Gastos muy grandes (alquiler, etc.)
            return fake()->randomFloat(2, 800, min($maxAmount, 1500));
        }
    }

    /**
     * Seleccionar etiqueta apropiada según el tipo de movimiento
     */
    private function selectAppropriateLabel(bool $isIncome, float $amount): Label
    {
        if ($isIncome) {
            // Para ingresos, preferir etiquetas como Nómina, etc.
            $incomeLabels = collect($this->labels)->filter(function ($label) {
                return in_array(strtolower($label->name), ['nómina', 'inversiones', 'ahorros']);
            });
            
            if ($incomeLabels->isNotEmpty()) {
                return $incomeLabels->random();
            }
        } else {
            // Para gastos, seleccionar según el monto
            if ($amount > 800) {
                $expensiveLabels = collect($this->labels)->filter(function ($label) {
                    return in_array(strtolower($label->name), ['alquiler', 'seguros', 'viajes', 'tecnología']);
                });
                if ($expensiveLabels->isNotEmpty()) {
                    return $expensiveLabels->random();
                }
            } elseif ($amount > 200) {
                $mediumLabels = collect($this->labels)->filter(function ($label) {
                    return in_array(strtolower($label->name), ['supermercado', 'gasolina', 'ropa', 'ocio']);
                });
                if ($mediumLabels->isNotEmpty()) {
                    return $mediumLabels->random();
                }
            }
        }

        // Fallback: etiqueta aleatoria
        return collect($this->labels)->random();
    }

    /**
     * Generar comentario de movimiento
     */
    private function generateMovementComment(string $labelName, bool $isIncome): string
    {
        if ($isIncome) {
            return match(strtolower($labelName)) {
                'nómina' => fake()->randomElement(['Salario mensual', 'Pago nómina', 'Ingreso salario']),
                'inversiones' => fake()->randomElement(['Dividendos', 'Beneficio inversión', 'Rentabilidad cartera']),
                default => fake()->randomElement(['Ingreso varios', 'Transferencia recibida', 'Otros ingresos'])
            };
        } else {
            return match(strtolower($labelName)) {
                'supermercado' => fake()->randomElement(['Compra Mercadona', 'Carrefour', 'Compra semanal']),
                'gasolina' => fake()->randomElement(['Repsol', 'Cepsa', 'Repostaje']),
                'restaurantes' => fake()->randomElement(['Cena fuera', 'Almuerzo', 'Comida delivery']),
                'ocio' => fake()->randomElement(['Cine', 'Concierto', 'Actividades weekend']),
                default => fake()->sentence(3)
            };
        }
    }
}