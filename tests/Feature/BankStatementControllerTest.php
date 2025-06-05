<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\User;
use App\Models\Bank;
use App\Models\Label;
use App\Models\Movement;
use App\Models\MovementType;

class BankStatementControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Bank $bank;
    protected Label $label;
    protected MovementType $incomeType;
    protected MovementType $expenseType;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        // Crear movement types correctamente
        $this->incomeType = MovementType::create([
            'id' => 1, 
            'code' => 'I',
            'name' => 'Income' // Añadir name si es requerido
        ]);
        
        $this->expenseType = MovementType::create([
            'id' => 2, 
            'code' => 'E',
            'name' => 'Expense' // Añadir name si es requerido
        ]);

        $this->bank = Bank::create([
            'name' => 'BBVA',
            'transaction_date_field' => 0,
            'value_date_field' => 1,
            'label_field' => 2,
            'amount_field' => 3,
            'balance_field' => 4,
        ]);

        $this->label = Label::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Test Label'
        ]);
    }

    public function test_requires_authentication_to_process_pdf()
    {
        $file = UploadedFile::fake()->create('test.pdf', 100, 'application/pdf');

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => $this->bank->id,
        ]);

        $response->assertStatus(401);
    }

    public function test_validates_required_fields()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/bank-statements/process', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['pdf_file', 'bank_id']);
    }

    public function test_validates_pdf_file_type()
    {
        $this->actingAs($this->user);

        $file = UploadedFile::fake()->create('test.txt', 100, 'text/plain');

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => $this->bank->id,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['pdf_file']);
    }

    public function test_validates_file_size()
    {
        $this->actingAs($this->user);

        $file = UploadedFile::fake()->create('large.pdf', 16000, 'application/pdf');

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => $this->bank->id,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['pdf_file']);
    }

    public function test_validates_bank_exists()
    {
        $this->actingAs($this->user);

        $file = UploadedFile::fake()->create('test.pdf', 100, 'application/pdf');

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => 999,
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['bank_id']);
    }

    public function test_successfully_processes_pdf_with_valid_python_api_response()
    {
        $this->actingAs($this->user);

        Http::fake([
            'http://127.0.0.1:5000/extract-movements' => Http::response([
                'success' => true,
                'movements' => [
                    [
                        'transaction_date' => '02/12',
                        'value_date' => '30/11',
                        'concept' => 'TRANSFERENCIA TEST',
                        'amount' => '50.00',
                        'balance' => '1000.00',
                        'movement_type' => 'I'
                    ],
                    [
                        'transaction_date' => '03/12',
                        'value_date' => '03/12',
                        'concept' => 'PAGO CON TARJETA TEST',
                        'amount' => '-25.50',
                        'balance' => '974.50',
                        'movement_type' => 'E'
                    ]
                ],
                'total_movements' => 2
            ], 200)
        ]);

        // Crear un archivo PDF falso con contenido válido
        $file = UploadedFile::fake()->createWithContent(
            'test.pdf', 
            '%PDF-1.4' . str_repeat('A', 95), // Contenido mínimo para parecer PDF
            'application/pdf'
        );

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => $this->bank->id,
        ]);

        // Si el test falla, imprimir el contenido de la respuesta para debug
        if ($response->getStatusCode() !== 200) {
            dump([
                'status' => $response->getStatusCode(),
                'content' => $response->getContent(),
                'headers' => $response->headers->all()
            ]);
        }

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'total_count' => 2,
                    'raw_count' => 2
                ])
                ->assertJsonStructure([
                    'success',
                    'movements' => [
                        '*' => [
                            'movement_type_id',
                            'label_id',
                            'bank_id',
                            'transaction_date',
                            'value_date',
                            'amount',
                            'balance',
                            'comment',
                            'original_amount',
                            'suggested_type'
                        ]
                    ],
                    'total_count',
                    'raw_count'
                ]);

        $movements = $response->json('movements');
        
        $this->assertCount(2, $movements);
        
        $this->assertEquals(1, $movements[0]['movement_type_id']);
        $this->assertEquals($this->bank->id, $movements[0]['bank_id']);
        $this->assertEquals(50.0, $movements[0]['amount']);
        $this->assertEquals(1000.0, $movements[0]['balance']);
        $this->assertStringContainsString('TRANSFERENCIA TEST', $movements[0]['comment']);
        
        $this->assertEquals(2, $movements[1]['movement_type_id']);
        $this->assertEquals(25.5, $movements[1]['amount']);
        $this->assertEquals(-25.5, $movements[1]['original_amount']);
    }

    public function test_handles_python_api_failure()
    {
        $this->actingAs($this->user);

        Http::fake([
            'http://127.0.0.1:5000/extract-movements' => Http::response([
                'success' => false,
                'errors' => ['Could not process PDF']
            ], 200) // Cambiar a 200 porque la API devuelve 200 con success=false
        ]);

        $file = UploadedFile::fake()->createWithContent(
            'test.pdf', 
            '%PDF-1.4' . str_repeat('A', 95),
            'application/pdf'
        );

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => $this->bank->id,
        ]);

        // Debug si falla
        if ($response->getStatusCode() !== 400) {
            dump([
                'status' => $response->getStatusCode(),
                'content' => $response->getContent()
            ]);
        }

        $response->assertStatus(400)
                ->assertJson([
                    'success' => false,
                    'message' => 'Error extracting data from PDF: Could not process PDF'
                ]);
    }

    public function test_handles_python_api_connection_failure()
    {
        $this->actingAs($this->user);

        Http::fake([
            'http://127.0.0.1:5000/extract-movements' => Http::response('', 500)
        ]);

        $file = UploadedFile::fake()->createWithContent(
            'test.pdf', 
            '%PDF-1.4' . str_repeat('A', 95),
            'application/pdf'
        );

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => $this->bank->id,
        ]);

        $response->assertStatus(500)
                ->assertJson([
                    'success' => false
                ])
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);
    }

    public function test_saves_movements_successfully()
    {
        $this->actingAs($this->user);

        $movementsData = [
            [
                'movement_type_id' => $this->incomeType->id,
                'label_id' => $this->label->id,
                'bank_id' => $this->bank->id,
                'transaction_date' => '2024-12-02',
                'value_date' => '2024-12-02',
                'amount' => 50.00,
                'balance' => 1000.00,
                'comment' => 'Test income movement'
            ],
            [
                'movement_type_id' => $this->expenseType->id,
                'label_id' => $this->label->id,
                'bank_id' => $this->bank->id,
                'transaction_date' => '2024-12-03',
                'value_date' => '2024-12-03',
                'amount' => 25.50,
                'balance' => 974.50,
                'comment' => 'Test expense movement'
            ]
        ];

        $response = $this->postJson('/api/bank-statements/save', [
            'movements' => $movementsData
        ]);

        if ($response->getStatusCode() !== 200) {
            dump([
                'status' => $response->getStatusCode(),
                'content' => $response->getContent(),
                'movement_types_count' => MovementType::count(),
                'movement_types' => MovementType::all()->toArray()
            ]);
        }

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'saved_count' => 2,
                    'errors' => []
                ])
                ->assertJsonStructure([
                    'success',
                    'saved_movements' => [
                        '*' => [
                            'id',
                            'user_id',
                            'movement_type_id',
                            'label_id',
                            'bank_id',
                            'transaction_date',
                            'value_date',
                            'amount',
                            'balance',
                            'comment',
                            'label' => ['id', 'name'],
                            'bank' => ['id', 'name'],
                            'movement_type' => ['id', 'code']
                        ]
                    ],
                    'saved_count',
                    'errors'
                ]);

        $this->assertDatabaseCount('movements', 2);
        
        $this->assertDatabaseHas('movements', [
            'user_id' => $this->user->id,
            'movement_type_id' => $this->incomeType->id,
            'label_id' => $this->label->id,
            'bank_id' => $this->bank->id,
            'amount' => 50.00,
            'balance' => 1000.00,
            'comment' => 'Test income movement'
        ]);

        $this->assertDatabaseHas('movements', [
            'user_id' => $this->user->id,
            'movement_type_id' => $this->expenseType->id,
            'label_id' => $this->label->id,
            'bank_id' => $this->bank->id,
            'amount' => 25.50,
            'balance' => 974.50,
            'comment' => 'Test expense movement'
        ]);
    }

    public function test_validates_movements_data_for_saving()
    {
        $this->actingAs($this->user);

        $invalidMovementsData = [
            [
                // Falta movement_type_id
                'label_id' => $this->label->id,
                'bank_id' => $this->bank->id,
            ],
            [
                'movement_type_id' => 999, // ID que no existe
                'label_id' => $this->label->id,
                'bank_id' => $this->bank->id,
                'transaction_date' => '2024-12-03',
                'value_date' => '2024-12-03',
                'amount' => 25.50,
                'balance' => 974.50,
            ]
        ];

        $response = $this->postJson('/api/bank-statements/save', [
            'movements' => $invalidMovementsData
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'movements.0.movement_type_id',
                    'movements.0.transaction_date',
                    'movements.0.value_date',
                    'movements.0.amount',
                    'movements.1.movement_type_id'
                ]);
    }

    public function test_prevents_saving_movements_with_labels_from_other_users()
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $otherLabel = Label::factory()->create([
            'user_id' => $otherUser->id,
            'name' => 'Other User Label'
        ]);

        $movementsData = [
            [
                'movement_type_id' => $this->incomeType->id,
                'label_id' => $otherLabel->id,
                'bank_id' => $this->bank->id,
                'transaction_date' => '2024-12-02',
                'value_date' => '2024-11-30',
                'amount' => 50.00,
                'balance' => 1000.00,
                'comment' => 'Test movement'
            ]
        ];

        $response = $this->postJson('/api/bank-statements/save', [
            'movements' => $movementsData
        ]);

        // Debug si falla
        if ($response->getStatusCode() !== 200 || $response->json('saved_count') !== 0) {
            dump([
                'status' => $response->getStatusCode(),
                'content' => $response->getContent()
            ]);
        }

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'saved_count' => 0,
                    'errors' => ['Movement 0: Label not found']
                ]);

        $this->assertDatabaseCount('movements', 0);
    }

    public function test_accepts_octet_stream_mime_type()
    {
        $this->actingAs($this->user);

        $file = UploadedFile::fake()->createWithContent(
            'test.pdf', 
            '%PDF-1.4' . str_repeat('A', 95),
            'application/octet-stream'
        );

        Http::fake([
            'http://127.0.0.1:5000/extract-movements' => Http::response([
                'success' => true,
                'movements' => [],
                'total_movements' => 0
            ], 200)
        ]);

        $response = $this->postJson('/api/bank-statements/process', [
            'pdf_file' => $file,
            'bank_id' => $this->bank->id,
        ]);

        // Debug si falla 
        if ($response->getStatusCode() !== 200) {
            dump([
                'status' => $response->getStatusCode(),
                'content' => $response->getContent()
            ]);
        }

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'total_count' => 0
                ]);
    }
}