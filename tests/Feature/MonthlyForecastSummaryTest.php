<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Label;
use App\Models\MonthlyForecast;
use App\Models\Movement;
use App\Models\Bank;
use App\Models\MovementType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class MonthlyForecastSummaryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Label $label;
    private Bank $bank;
    private MovementType $movementType;

    protected function setUp(): void
    {
        parent::setUp();
        
        MovementType::factory()->create(['code' => 'I']);
        MovementType::factory()->create(['code' => 'E']);
        
        $this->user = User::factory()->create();
        $this->label = Label::factory()->create(['user_id' => $this->user->id]);
        $this->bank = Bank::factory()->create();
        $this->movementType = MovementType::first();
    }

public function test_can_get_monthly_forecasts_summary()
{
    $currentYear = Carbon::now()->year;
    $currentMonth = Carbon::now()->month;

    $forecast = MonthlyForecast::factory()->create([
        'user_id' => $this->user->id,
        'label_id' => $this->label->id,
        'year' => $currentYear,
        'month' => $currentMonth,
        'amount' => 1000.00,
        'comment' => 'Test forecast'
    ]);

    $transactionDate1 = Carbon::create($currentYear, $currentMonth, 15);
    $transactionDate2 = Carbon::create($currentYear, $currentMonth, 20);

    Movement::factory()->create([
        'user_id' => $this->user->id,
        'label_id' => $this->label->id,
        'bank_id' => $this->bank->id,
        'movement_type_id' => $this->movementType->id,
        'transaction_date' => $transactionDate1,
        'value_date' => $transactionDate1,
        'amount' => 300.00
    ]);

    Movement::factory()->create([
        'user_id' => $this->user->id,
        'label_id' => $this->label->id,
        'bank_id' => $this->bank->id,
        'movement_type_id' => $this->movementType->id,
        'transaction_date' => $transactionDate2,
        'value_date' => $transactionDate2,
        'amount' => 200.00
    ]);

    $response = $this->actingAs($this->user)
        ->getJson('/api/monthly-forecasts-summary');

    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => [
                'label',
                'label_id',
                'year',
                'month',
                'forecasted_amount',
                'executed_amount',
                'completion',
                'comment'
            ]
        ])
        ->assertJsonFragment([
            'label' => $this->label->name,
            'forecasted_amount' => 1000.0,
            'executed_amount' => 500.0,
            'completion' => 50.0
        ]);
}


    public function test_summary_with_no_movements()
    {
        $forecast = MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'amount' => 1000.00
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/monthly-forecasts-summary');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'executed_amount' => 0.0,
                'completion' => 0.0
            ]);
    }

    public function test_summary_only_shows_own_forecasts()
    {
        $otherUser = User::factory()->create();
        $otherLabel = Label::factory()->create(['user_id' => $otherUser->id]);
        
        MonthlyForecast::factory()->create([
            'user_id' => $otherUser->id,
            'label_id' => $otherLabel->id
        ]);

        MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/monthly-forecasts-summary');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_requires_authentication_for_summary()
    {
        $response = $this->getJson('/api/monthly-forecasts-summary');
        $response->assertStatus(401);
    }
}