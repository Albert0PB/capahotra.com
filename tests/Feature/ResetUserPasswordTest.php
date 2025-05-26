<?php

namespace Tests\Feature\Actions\Fortify;

use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ResetUserPasswordTest extends TestCase
{
    use RefreshDatabase;

    protected ResetUserPassword $action;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new ResetUserPassword();
        $this->user = User::factory()->create([
            'password' => Hash::make('old_password')
        ]);
    }

    public function test_can_reset_user_password_with_valid_data()
    {
        $inputData = [
            'password' => 'new_password123',
            'password_confirmation' => 'new_password123',
        ];

        $this->action->reset($this->user, $inputData);

        $this->user->refresh();
        $this->assertTrue(Hash::check('new_password123', $this->user->password));
        $this->assertFalse(Hash::check('old_password', $this->user->password));
    }

    public function test_cannot_reset_password_without_password()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'password_confirmation' => 'new_password123',
        ];

        $this->action->reset($this->user, $inputData);
    }

    public function test_cannot_reset_password_with_empty_password()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'password' => '',
            'password_confirmation' => '',
        ];

        $this->action->reset($this->user, $inputData);
    }

    public function test_cannot_reset_password_without_confirmation()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'password' => 'new_password123',
        ];

        $this->action->reset($this->user, $inputData);
    }

    public function test_cannot_reset_password_with_mismatched_confirmation()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'password' => 'new_password123',
            'password_confirmation' => 'different_password',
        ];

        $this->action->reset($this->user, $inputData);
    }

    public function test_password_is_properly_hashed_after_reset()
    {
        $plainPassword = 'new_password123';
        $inputData = [
            'password' => $plainPassword,
            'password_confirmation' => $plainPassword,
        ];

        $this->action->reset($this->user, $inputData);

        $this->user->refresh();
        $this->assertNotEquals($plainPassword, $this->user->password);
        $this->assertTrue(Hash::check($plainPassword, $this->user->password));
    }
}