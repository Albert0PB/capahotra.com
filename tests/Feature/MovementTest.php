<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Label;
use App\Models\Movement;
use App\Models\Bank;
use App\Models\MovementType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MovementTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Label $label;
    private Bank $bank;
    private MovementType $movementType;

    protected function setUp(): void
    {
        parent::setUp();        

        $this->user = User::factory()->create();
        $this->label = Label::factory()->create(['user_id' => $this->user->id]);
        $this->bank = Bank::factory()->create();

        $this->incomeType = MovementType::factory()->create(['code' => 'I']);
        $this->expenseType = MovementType::factory()->create(['code' => 'E']);

        $this->movementType = $this->expenseType;
    }

    public function test_can_get_movements_list()
    {
        Movement::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'bank_id' => $this->bank->id,
            'movement_type_id' => $this->movementType->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/movements');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_movement()
    {
        $movementData = [
            'label_id' => $this->label->id,
            'movement_type_id' => $this->movementType->id,
            'bank_id' => $this->bank->id,
            'amount' => 100.50,
            'transaction_date' => '2025-05-26',
            'value_date' => '2025-05-26',
            'comment' => 'Test movement',
            'balance' => 0,
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/movements', $movementData);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'movement_type_id' => $this->movementType->id,
                'amount' => 100.50,
                'comment' => 'Test movement',
                'balance' => 0,
            ]);

        $this->assertDatabaseHas('movements', [
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'movement_type_id' => $this->movementType->id,
            'amount' => 100.50,
            'balance' => 0,
        ]);
    }

    public function test_validates_required_fields_for_movement_creation()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/movements', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => [
                    'label_id',
                    'amount',
                    'transaction_date'
                ]
            ]);
    }

    public function test_validates_label_exists_for_movement()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/movements', [
                'label_id' => 999999,
                'amount' => 100.50,
                'transaction_date' => '2025-05-26'
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('errors.label_id', ['The selected label id is invalid.']);
    }

    public function test_validates_amount_is_numeric()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/movements', [
                'label_id' => $this->label->id,
                'amount' => 'not-numeric',
                'transaction_date' => '2025-05-26'
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('errors.amount', ['The amount field must be a number.']);
    }

    public function test_validates_date_format()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/movements', [
                'label_id' => $this->label->id,
                'amount' => 100.50,
                'transaction_date' => 'invalid-date'
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('errors.transaction_date', ['The transaction date field must be a valid date.']);
    }

    public function test_can_show_own_movement()
    {
        $movement = Movement::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'bank_id' => $this->bank->id,
            'movement_type_id' => $this->movementType->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/movements/{$movement->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $movement->id]);
    }

    public function test_cannot_show_other_users_movement()
    {
        $otherUser = User::factory()->create();
        $otherLabel = Label::factory()->create(['user_id' => $otherUser->id]);
        $otherMovement = Movement::factory()->create([
            'user_id' => $otherUser->id,
            'label_id' => $otherLabel->id,
            'bank_id' => $this->bank->id,
            'movement_type_id' => $this->movementType->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/movements/{$otherMovement->id}");

        $response->assertStatus(403);
    }

    public function test_can_update_own_movement()
    {
        $movement = Movement::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'bank_id' => $this->bank->id,
            'movement_type_id' => $this->movementType->id,
            'transaction_date' => '2025-05-26',
            'value_date' => '2025-05-26'
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/movements/{$movement->id}", [
                'label_id' => $this->label->id,
                'amount' => '200.75',
                'transaction_date' => '2025-05-26',
                'value_date' => '2025-05-26',
                'comment' => 'Updated movement'
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'amount' => '200.75',
                'comment' => 'Updated movement'
            ]);
    }

    public function test_can_delete_own_movement()
    {
        $movement = Movement::factory()->create([
            'user_id' => $this->user->id,
            'label_id' => $this->label->id,
            'bank_id' => $this->bank->id,
            'movement_type_id' => $this->movementType->id
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/movements/{$movement->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Movement deleted successfully.']);

        $this->assertDatabaseMissing('movements', ['id' => $movement->id]);
    }

    public function test_requires_authentication()
    {
        $response = $this->getJson('/api/movements');
        $response->assertStatus(401);
    }
}
