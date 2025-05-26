<?php

namespace Tests\Feature\Actions\Fortify;

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class CreateNewUserTest extends TestCase
{
    use RefreshDatabase;

    protected CreateNewUser $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new CreateNewUser();
    }

    public function test_can_create_new_user_with_valid_data()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $user = $this->action->create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }

    public function test_cannot_create_user_without_name()
    {
        $this->expectException(ValidationException::class);

        $userData = [
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->action->create($userData);
    }

    public function test_cannot_create_user_with_empty_name()
    {
        $this->expectException(ValidationException::class);

        $userData = [
            'name' => '',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->action->create($userData);
    }

    public function test_cannot_create_user_with_name_too_long()
    {
        $this->expectException(ValidationException::class);

        $userData = [
            'name' => str_repeat('a', 256),
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->action->create($userData);
    }

    public function test_cannot_create_user_without_email()
    {
        $this->expectException(ValidationException::class);

        $userData = [
            'name' => 'John Doe',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->action->create($userData);
    }

    public function test_cannot_create_user_with_invalid_email()
    {
        $this->expectException(ValidationException::class);

        $userData = [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->action->create($userData);
    }

    public function test_cannot_create_user_with_duplicate_email()
    {
        User::factory()->create(['email' => 'john@example.com']);

        $this->expectException(ValidationException::class);

        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->action->create($userData);
    }

    public function test_cannot_create_user_without_password()
    {
        $this->expectException(ValidationException::class);

        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ];

        $this->action->create($userData);
    }

    public function test_cannot_create_user_with_unconfirmed_password()
    {
        $this->expectException(ValidationException::class);

        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different_password',
        ];

        $this->action->create($userData);
    }
}