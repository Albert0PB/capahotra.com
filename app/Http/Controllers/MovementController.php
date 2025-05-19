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
            $user->movements()->with('label')->orderBy('date', 'desc')->get()
        );
    }

    /**
     * Store a newly created movement.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label_id' => 'required|exists:labels,id',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $movement = Movement::create([
            'user_id' => Auth::id(),
            'label_id' => $request->label_id,
            'amount' => $request->amount,
            'date' => $request->date,
            'description' => $request->description,
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
            'date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $movement->update([
            'label_id' => $request->label_id,
            'amount' => $request->amount,
            'date' => $request->date,
            'description' => $request->description,
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
