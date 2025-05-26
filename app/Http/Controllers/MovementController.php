<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MovementController extends Controller
{
    /**
     * Display a listing of the user's movements.
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json(
            $user->movements()->with('label')->orderBy('transaction_date', 'desc')->get()
        );
    }

    /**
     * Store a newly created movement.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label_id' => 'required|exists:labels,id',
            'movement_type_id' => 'required|exists:movement_types,id',
            'bank_id' => 'required|exists:banks,id',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'value_date' => 'required|date',
            'comment' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $movement = Movement::create([
            'user_id' => Auth::id(),
            'label_id' => $request->label_id,
            'movement_type_id' => $request->movement_type_id,
            'bank_id' => $request->bank_id,
            'amount' => $request->amount,
            'transaction_date' => $request->transaction_date,
            'value_date' => $request->value_date,
            'comment' => $request->comment,
            'balance' => 0,
        ]);

        return response()->json($movement, 201);
    }

    /**
     * Display a specific movement.
     */
    public function show(Movement $movement)
    {
        $this->authorizeAccess($movement);
        return response()->json($movement->load('label'));
    }

    /**
     * Update a movement.
     */
    public function update(Request $request, Movement $movement)
    {
        $this->authorizeAccess($movement);

        $validator = Validator::make($request->all(), [
            'label_id' => 'required|exists:labels,id',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'comment' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $movement->update([
            'label_id' => $request->label_id,
            'amount' => $request->amount,
            'transaction_date' => $request->transaction_date,
            'comment' => $request->comment,
        ]);

        return response()->json($movement);
    }

    /**
     * Remove a movement.
     */
    public function destroy(Movement $movement)
    {
        $this->authorizeAccess($movement);
        $movement->delete();

        return response()->json(['message' => 'Movement deleted successfully.']);
    }

    /**
     * Ensure the movement belongs to the authenticated user.
     */
    private function authorizeAccess(Movement $movement)
    {
        if ($movement->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
    }

}
