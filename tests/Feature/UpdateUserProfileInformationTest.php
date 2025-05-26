<?php

namespace Tests\Feature\Actions\Fortify;

use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class UpdateUserProfileInformationTest extends TestCase
{
    use RefreshDatabase;

    protected UpdateUserProfileInformation $action;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new UpdateUserProfileInformation();
        $this->user = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
        ]);
    }

    public function test_can_update_profile_information_with_valid_data()
    {
        $inputData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ];

        $this->action->update($this->user, $inputData);

        $this->user->refresh();
        $this->assertEquals('Updated Name', $this->user->name);
        $this->assertEquals('updated@example.com', $this->user->email);
    }

    public function test_can_update_name_only()
    {
        $inputData = [
            'name' => 'New Name',
            'email' => $this->user->email,
        ];

        $this->action->update($this->user, $inputData);

        $this->user->refresh();
        $this->assertEquals('New Name', $this->user->name);
        $this->assertEquals('original@example.com', $this->user->email);
    }

    public function test_cannot_update_without_name()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'email' => 'updated@example.com',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_with_empty_name()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'name' => '',
            'email' => 'updated@example.com',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_with_name_too_long()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'name' => str_repeat('a', 256),
            'email' => 'updated@example.com',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_without_email()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'name' => 'Updated Name',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_with_invalid_email()
    {
        $this->expectException(ValidationException::class);

        $inputData = [
            'name' => 'Updated Name',
            'email' => 'invalid-email',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_cannot_update_with_duplicate_email()
    {
        $anotherUser = User::factory()->create(['email' => 'taken@example.com']);

        $this->expectException(ValidationException::class);

        $inputData = [
            'name' => 'Updated Name',
            'email' => 'taken@example.com',
        ];

        $this->action->update($this->user, $inputData);
    }

    public function test_can_keep_same_email()
    {
        $inputData = [
            'name' => 'Updated Name',
            'email' => $this->user->email,
        ];

        $this->action->update($this->user, $inputData);

        $this->user->refresh();
        $this->assertEquals('Updated Name', $this->user->name);
        $this->assertEquals('original@example.com', $this->user->email);
    }
}