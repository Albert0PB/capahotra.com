<?php

namespace Tests\Feature;

use App\Models\Label;
use App\Models\Movement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LabelTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ========================================
    // TESTS DEL CONTROLADOR (API/HTTP)
    // ========================================

    public function test_authenticated_user_can_get_their_labels()
    {
        $names = ['Label1', 'Label2', 'Label3'];

        foreach ($names as $name) {
            Label::factory()->create([
                'user_id' => $this->user->id,
                'name' => $name,
            ]);
        }

        $otherUser = User::factory()->create();

        // Usa nombres distintos para el otro usuario para evitar colisiones
        foreach (['Other1', 'Other2', 'Other3'] as $name) {
            Label::factory()->create([
                'user_id' => $otherUser->id,
                'name' => $name,
            ]);
        }

        $response = $this->actingAs($this->user)
            ->getJson('/api/labels');

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'user_id', 'created_at', 'updated_at']
            ]);
    }

    public function test_unauthenticated_user_cannot_access_labels()
    {
        $response = $this->getJson('/api/labels');
        
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_label()
    {
        $labelData = [
            'name' => 'Nuevo Label'
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/labels', $labelData);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'user_id', 'created_at', 'updated_at'])
            ->assertJson([
                'name' => 'Nuevo Label',
                'user_id' => $this->user->id
            ]);

        $this->assertDatabaseHas('labels', [
            'name' => 'Nuevo Label',
            'user_id' => $this->user->id
        ]);
    }

    public function test_label_creation_requires_name()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/labels', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_label_name_cannot_exceed_100_characters()
    {
        $labelData = [
            'name' => str_repeat('a', 101)
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/labels', $labelData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_authenticated_user_can_view_their_label()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/labels/{$label->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $label->id,
                'name' => $label->name,
                'user_id' => $this->user->id
            ]);
    }

    public function test_user_cannot_view_other_users_label()
    {
        $otherUser = User::factory()->create();
        $label = Label::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/labels/{$label->id}");

        $response->assertStatus(403);
    }

    public function test_authenticated_user_can_update_their_label()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);
        $updateData = ['name' => 'Label Actualizado'];

        $response = $this->actingAs($this->user)
            ->putJson("/api/labels/{$label->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $label->id,
                'name' => 'Label Actualizado',
                'user_id' => $this->user->id
            ]);

        $this->assertDatabaseHas('labels', [
            'id' => $label->id,
            'name' => 'Label Actualizado'
        ]);
    }

    public function test_user_cannot_update_other_users_label()
    {
        $otherUser = User::factory()->create();
        $label = Label::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/labels/{$label->id}", ['name' => 'Hack']);

        $response->assertStatus(403);
    }

    public function test_authenticated_user_can_delete_their_label()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/labels/{$label->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('labels', ['id' => $label->id]);
    }

    public function test_user_cannot_delete_other_users_label()
    {
        $otherUser = User::factory()->create();
        $label = Label::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/labels/{$label->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('labels', ['id' => $label->id]);
    }

    public function test_cannot_create_duplicate_label_name_for_same_user()
    {
        Label::factory()->create([
            'name' => 'Duplicated Label',
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/labels', ['name' => 'Duplicated Label']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_create_same_label_name_for_different_users()
    {
        $otherUser = User::factory()->create();
        
        Label::factory()->create([
            'name' => 'Same Name',
            'user_id' => $otherUser->id
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/labels', ['name' => 'Same Name']);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Same Name',
                'user_id' => $this->user->id
            ]);
    }

    // ========================================
    // TESTS DEL MODELO
    // ========================================

    public function test_label_model_can_be_created()
    {
        $label = Label::factory()->create([
            'name' => 'Test Label Model',
            'user_id' => $this->user->id
        ]);

        $this->assertInstanceOf(Label::class, $label);
        $this->assertEquals('Test Label Model', $label->name);
        $this->assertEquals($this->user->id, $label->user_id);
        $this->assertDatabaseHas('labels', [
            'name' => 'Test Label Model',
            'user_id' => $this->user->id
        ]);
    }

    public function test_label_model_has_fillable_attributes()
    {
        $label = new Label();
        $fillable = $label->getFillable();

        $this->assertContains('name', $fillable);
        $this->assertContains('user_id', $fillable);
        $this->assertCount(2, $fillable);
    }

    public function test_label_model_has_many_movements()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);
        $movements = Movement::factory()->count(3)->create([
            'label_id' => $label->id,
            'user_id' => $this->user->id
        ]);

        $this->assertCount(3, $label->movements);
        $this->assertInstanceOf(Movement::class, $label->movements->first());
        
        // Verificar que todos los movimientos pertenecen al label
        foreach ($label->movements as $movement) {
            $this->assertEquals($label->id, $movement->label_id);
        }
    }

    public function test_label_model_can_have_no_movements()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);

        $this->assertCount(0, $label->movements);
        $this->assertTrue($label->movements->isEmpty());
    }

    public function test_label_model_movements_relationship_returns_collection()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $label->movements);
    }

    public function test_label_model_can_be_mass_assigned()
    {
        $labelData = [
            'name' => 'Mass Assignment Label',
            'user_id' => $this->user->id
        ];

        $label = Label::create($labelData);

        $this->assertEquals('Mass Assignment Label', $label->name);
        $this->assertEquals($this->user->id, $label->user_id);
    }

    public function test_label_model_has_timestamps()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);

        $this->assertNotNull($label->created_at);
        $this->assertNotNull($label->updated_at);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $label->created_at);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $label->updated_at);
    }

    public function test_multiple_labels_can_belong_to_same_user()
    {
        $label1 = Label::factory()->create([
            'name' => 'Label 1',
            'user_id' => $this->user->id
        ]);
        $label2 = Label::factory()->create([
            'name' => 'Label 2', 
            'user_id' => $this->user->id
        ]);

        $this->assertEquals($this->user->id, $label1->user_id);
        $this->assertEquals($this->user->id, $label2->user_id);
        $this->assertNotEquals($label1->id, $label2->id);
    }

    public function test_label_model_uses_has_factory_trait()
    {
        $this->assertTrue(in_array(\Illuminate\Database\Eloquent\Factories\HasFactory::class, class_uses(Label::class)));
    }

    public function test_label_model_can_access_movements_through_relationship()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);
        $movement = Movement::factory()->create([
            'label_id' => $label->id,
            'user_id' => $this->user->id
        ]);

        $retrievedMovement = $label->movements()->first();
        
        $this->assertInstanceOf(Movement::class, $retrievedMovement);
        $this->assertEquals($movement->id, $retrievedMovement->id);
        $this->assertEquals($label->id, $retrievedMovement->label_id);
    }

    public function test_label_model_relationship_query_works()
    {
        $label = Label::factory()->create(['user_id' => $this->user->id]);
        Movement::factory()->count(2)->create([
            'label_id' => $label->id,
            'user_id' => $this->user->id
        ]);
        
        // Crear movimientos de otro label para verificar que no se incluyen
        $otherLabel = Label::factory()->create(['user_id' => $this->user->id]);
        Movement::factory()->create([
            'label_id' => $otherLabel->id,
            'user_id' => $this->user->id
        ]);

        $labelMovements = $label->movements()->get();
        
        $this->assertCount(2, $labelMovements);
        foreach ($labelMovements as $movement) {
            $this->assertEquals($label->id, $movement->label_id);
        }
    }
}