<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class DeleteUser
{
    /**
     * Validate and delete the given user.
     *
     * @param  \App\Models\User  $user
     * @param  array  $input
     * @return void
     */
    public function delete(User $user, array $input): void
    {
        Validator::make($input, [
            'password' => ['required', 'string'],
        ])->validate();

        if (! Hash::check($input['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => [__('The provided password does not match your current password.')],
            ]);
        }

        $user->movements()->delete();
        $user->labels()->delete();
        $user->monthlyForecasts()->delete();
        
        $user->delete();
    }
}