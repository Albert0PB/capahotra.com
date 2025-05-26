<?php

namespace Tests\Feature\Actions\Fortify;

use App\Actions\Fortify\UpdateUserPassword;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class UpdateUserPasswordTest extends TestCase
{
    use RefreshDatabase;

    protected UpdateUserPassword $action;
    protected User $user;
    protected string $currentPassword = 'current_password123';

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new UpdateUserPassword();
        $this->user = User::factory()->create([
            'password' => Hash::make($this->currentPassword)
        ]);
    }

    public function test_can_update_password_with_valid_data()
    {
        $inputData = [
            'current_password' => $this->currentPassword,
            'password' => 'new_password123',
            'password_confirmation' => 'new_password123',
        ];

        $this->actingAs($this->user);
        $this->action->update($this->user, $inputData);

        $this->user->refresh();
        $this->assertTrue(Hash::check('new_password123', $this->user->password));
        $this->assertFalse(Hash::check($this->currentPassword, $this->user->password));
    }

    public function test_cannot_update_password_without_current_password()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'password' => 'new_password123',
            'password_confirmation' => 'new_password123',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_password_with_wrong_current_password()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'current_password' => 'wrong_password',
            'password' => 'new_password123',
            'password_confirmation' => 'new_password123',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_password_without_new_password()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'current_password' => $this->currentPassword,
            'password_confirmation' => 'new_password123',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_password_without_confirmation()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'current_password' => $this->currentPassword,
            'password' => 'new_password123',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_password_with_mismatched_confirmation()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'current_password' => $this->currentPassword,
            'password' => 'new_password123',
            'password_confirmation' => 'different_password',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_password_is_properly_hashed_after_update()
    {
        $newPassword = 'new_password123';
        $inputData = [
            'current_password' => $this->currentPassword,
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
        ];

        $this->actingAs($this->user);
        $this->action->update($this->user, $inputData);

        $this->user->refresh();
        $this->assertNotEquals($newPassword, $this->user->password);
        $this->assertTrue(Hash::check($newPassword, $this->user->password));
    }
}