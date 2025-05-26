<?php

namespace Tests\Feature;

use App\Models\Label;
use App\Models\MonthlyForecast;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MonthlyForecastTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $label;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->label = Label::factory()->create(['user_id' => $this->user->id]);
    }

    // ========================================
    // TESTS DEL CONTROLADOR (API/HTTP)
    // ========================================

    public function test_authenticated_user_can_get_their_forecasts()
    {
        MonthlyForecast::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id
        ]);
        
        $otherUser = User::factory()->create();

        MonthlyForecast::factory()->count(2)->create([
            'user_id' => $otherUser->id,
        ]);


        $response = $this->actingAs($this->user)
            ->getJson('/api/monthly-forecasts');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }

    public function test_user_can_filter_forecasts_by_year()
    {
        MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'year' => 2025
        ]);
        MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'year' => 2024
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/monthly-forecasts?year=2025');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json());
        $this->assertEquals(2025, $response->json()[0]['year']);
    }

    public function test_user_can_filter_forecasts_by_year_and_month()
    {
        MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'year' => 2025,
            'month' => 5
        ]);
        MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'year' => 2025,
            'month' => 6
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/monthly-forecasts?year=2025&month=5');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json());
        $this->assertEquals(5, $response->json()[0]['month']);
    }

    public function test_authenticated_user_can_create_forecast()
    {
        $forecastData = [
            'label_id' => $this->label->id,
            'year' => 2025,
            'month' => 6,
            'amount' => 500.00,
            'comment' => 'Test forecast'
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/monthly-forecasts', $forecastData);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'user_id', 'label_id', 'year', 'month', 'amount', 'comment'])
            ->assertJson([
                'user_id' => $this->user->id,
                'label_id' => $this->label->id,
                'year' => 2025,
                'month' => 6,
                'amount' => 500.00,
                'comment' => 'Test forecast'
            ]);

        $this->assertDatabaseHas('monthly_forecasts', [
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'year' => 2025,
            'month' => 6,
            'amount' => 500.00
        ]);
    }

    public function test_forecast_creation_requires_all_required_fields()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/monthly-forecasts', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['label_id', 'year', 'month', 'amount']);
    }

    public function test_forecast_validates_label_exists()
    {
        $forecastData = [
            'label_id' => 999, // ID de label que no existe
            'year' => 2025,
            'month' => 6,
            'amount' => 500.00
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/monthly-forecasts', $forecastData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['label_id']);
    }

    public function test_forecast_validates_year_range()
    {
        $forecastData = [
            'label_id' => $this->label->id,
            'year' => 1999, // Año fuera del rango válido
            'month' => 6,
            'amount' => 500.00
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/monthly-forecasts', $forecastData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year']);
    }

    public function test_forecast_validates_month_range()
    {
        $forecastData = [
            'label_id' => $this->label->id,
            'year' => 2025,
            'month' => 13, // Mes inválido
            'amount' => 500.00
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/monthly-forecasts', $forecastData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['month']);
    }

    public function test_forecast_validates_amount_is_negative()
    {
        $forecastData = [
            'label_id' => $this->label->id,
            'year' => 2025,
            'month' => 6,
            'amount' => -100 // Cantidad negativa
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/monthly-forecasts', $forecastData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_authenticated_user_can_view_their_forecast()
    {
        $forecast = MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/monthly-forecasts/{$forecast->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $forecast->id,
                'user_id' => $this->user->id,
                'label_id' => $this->label->id
            ]);
    }

    public function test_user_cannot_view_other_users_forecast()
    {
        $otherUser = User::factory()->create();
        $otherLabel = Label::factory()->create(['user_id' => $otherUser->id]);
        $forecast = MonthlyForecast::factory()->create([
            'user_id' => $otherUser->id,
            'label_id' => $otherLabel->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/monthly-forecasts/{$forecast->id}");

        $response->assertStatus(403);
    }

    public function test_authenticated_user_can_update_their_forecast()
    {
        $forecast = MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id
        ]);

        $updateData = [
            'label_id' => $this->label->id,
            'year' => 2025,
            'month' => 7,
            'amount' => 750.00,
            'comment' => 'Updated forecast'
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/api/monthly-forecasts/{$forecast->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $forecast->id,
                'month' => 7,
                'amount' => 750.00,
                'comment' => 'Updated forecast'
            ]);

        $this->assertDatabaseHas('monthly_forecasts', [
            'id' => $forecast->id,
            'month' => 7,
            'amount' => 750.00,
            'comment' => 'Updated forecast'
        ]);
    }

    public function test_user_cannot_update_other_users_forecast()
    {
        $otherUser = User::factory()->create();
        $otherLabel = Label::factory()->create(['user_id' => $otherUser->id]);
        $forecast = MonthlyForecast::factory()->create([
            'user_id' => $otherUser->id,
            'label_id' => $otherLabel->id
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/monthly-forecasts/{$forecast->id}", [
                'amount' => 999
            ]);

        $response->assertStatus(403);
    }

    public function test_authenticated_user_can_delete_their_forecast()
    {
        $forecast = MonthlyForecast::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/monthly-forecasts/{$forecast->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('monthly_forecasts', ['id' => $forecast->id]);
    }

    public function test_user_cannot_delete_other_users_forecast()
    {
        $otherUser = User::factory()->create();
        $otherLabel = Label::factory()->create(['user_id' => $otherUser->id]);
        $forecast = MonthlyForecast::factory()->create([
            'user_id' => $otherUser->id,
            'label_id' => $otherLabel->id
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/monthly-forecasts/{$forecast->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('monthly_forecasts', ['id' => $forecast->id]);
    }

    public function test_unauthenticated_user_cannot_access_forecasts()
    {
        $response = $this->getJson('/api/monthly-forecasts');
        
        $response->assertStatus(401);
    }

    // ========================================
    // TESTS DEL MODELO
    // ========================================

    public function test_monthly_forecast_model_can_be_created()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'year' => 2024,
            'month' => 6,
            'amount' => 1500.50,
            'comment' => 'Test forecast model'
        ]);

        $this->assertInstanceOf(MonthlyForecast::class, $forecast);
        $this->assertEquals($this->label->id, $forecast->label_id);
        $this->assertEquals($this->user->id, $forecast->user_id);
        $this->assertEquals(2024, $forecast->year);
        $this->assertEquals(6, $forecast->month);
        $this->assertEquals(1500.50, $forecast->amount);
        $this->assertEquals('Test forecast model', $forecast->comment);
        
        $this->assertDatabaseHas('monthly_forecasts', [
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'year' => 2024,
            'month' => 6,
            'amount' => 1500.50,
            'comment' => 'Test forecast model'
        ]);
    }

    public function test_monthly_forecast_model_has_fillable_attributes()
    {
        $forecast = new MonthlyForecast();
        $fillable = $forecast->getFillable();

        $expectedFillable = ['label_id', 'user_id', 'year', 'month', 'amount', 'comment'];
        
        $this->assertEquals($expectedFillable, $fillable);
        $this->assertCount(6, $fillable);
    }

    public function test_monthly_forecast_model_belongs_to_label()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id
        ]);

        $this->assertInstanceOf(Label::class, $forecast->label);
        $this->assertEquals($this->label->id, $forecast->label->id);
        $this->assertEquals($this->label->name, $forecast->label->name);
    }

    public function test_monthly_forecast_model_can_be_mass_assigned()
    {
        $forecastData = [
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'year' => 2024,
            'month' => 11,
            'amount' => 2000.75,
            'comment' => 'Mass assignment test'
        ];

        $forecast = MonthlyForecast::create($forecastData);

        $this->assertEquals($this->label->id, $forecast->label_id);
        $this->assertEquals($this->user->id, $forecast->user_id);
        $this->assertEquals(2024, $forecast->year);
        $this->assertEquals(11, $forecast->month);
        $this->assertEquals(2000.75, $forecast->amount);
        $this->assertEquals('Mass assignment test', $forecast->comment);
    }

    public function test_monthly_forecast_model_has_timestamps()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id
        ]);

        $this->assertNotNull($forecast->created_at);
        $this->assertNotNull($forecast->updated_at);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $forecast->created_at);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $forecast->updated_at);
    }

    public function test_monthly_forecast_model_can_have_null_comment()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'comment' => null
        ]);

        $this->assertNull($forecast->comment);
    }

    public function test_monthly_forecast_model_can_have_negative_amount()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'amount' => -500.25
        ]);

        $this->assertEquals(-500.25, $forecast->amount);
    }

    public function test_multiple_forecasts_can_belong_to_same_label()
    {
        $forecast1 = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'month' => 1,
            'year' => 2024
        ]);
        
        $forecast2 = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'month' => 2,
            'year' => 2024
        ]);

        $this->assertEquals($this->label->id, $forecast1->label_id);
        $this->assertEquals($this->label->id, $forecast2->label_id);
        $this->assertNotEquals($forecast1->id, $forecast2->id);
    }

    public function test_monthly_forecast_model_uses_has_factory_trait()
    {
        $this->assertTrue(in_array(\Illuminate\Database\Eloquent\Factories\HasFactory::class, class_uses(MonthlyForecast::class)));
    }

    public function test_monthly_forecast_model_year_and_month_can_be_same_for_different_labels()
    {
        $label2 = Label::factory()->create(['user_id' => $this->user->id]);
        
        $forecast1 = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'year' => 2024,
            'month' => 6
        ]);
        
        $forecast2 = MonthlyForecast::factory()->create([
            'label_id' => $label2->id,
            'user_id' => $this->user->id,
            'year' => 2024,
            'month' => 6
        ]);

        $this->assertEquals(2024, $forecast1->year);
        $this->assertEquals(6, $forecast1->month);
        $this->assertEquals(2024, $forecast2->year);
        $this->assertEquals(6, $forecast2->month);
        $this->assertNotEquals($forecast1->label_id, $forecast2->label_id);
    }

    public function test_monthly_forecast_model_label_relationship_is_not_null()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id
        ]);

        $this->assertNotNull($forecast->label);
        $this->assertInstanceOf(Label::class, $forecast->label);
    }

    public function test_monthly_forecast_model_can_access_label_through_relationship()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id
        ]);

        $retrievedLabel = $forecast->label;
        
        $this->assertInstanceOf(Label::class, $retrievedLabel);
        $this->assertEquals($this->label->id, $retrievedLabel->id);
        $this->assertEquals($this->label->name, $retrievedLabel->name);
    }

    public function test_monthly_forecast_model_relationship_query_works()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id
        ]);
        
        // Crear otro label para verificar que no se incluye
        $otherLabel = Label::factory()->create(['user_id' => $this->user->id]);

        $labelFromForecast = $forecast->label()->first();
        
        $this->assertInstanceOf(Label::class, $labelFromForecast);
        $this->assertEquals($this->label->id, $labelFromForecast->id);
        $this->assertNotEquals($otherLabel->id, $labelFromForecast->id);
    }

    public function test_monthly_forecast_model_can_handle_decimal_amounts()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'amount' => 1234.56
        ]);

        $this->assertEquals(1234.56, $forecast->amount);
        $this->assertIsFloat($forecast->amount);
    }

    public function test_monthly_forecast_model_can_handle_large_amounts()
    {
        $forecast = MonthlyForecast::factory()->create([
            'label_id' => $this->label->id,
            'user_id' => $this->user->id,
            'amount' => 999999.99
        ]);

        $this->assertEquals(999999.99, $forecast->amount);
    }
}