<?php

namespace App\Http\Controllers;

use App\Models\Label;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LabelController extends Controller
{
    /**
     * Display a listing of the authenticated user's labels.
     */
    public function index()
    {
        $labels = Auth::user()->labels()->get();
        return response()->json($labels, 200);
    }

    /**
     * Store a newly created label for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $label = Auth::user()->labels()->create($validated);

        return response()->json($label, 201);
    }

    /**
     * Display the specified label if it belongs to the authenticated user.
     */
    public function show(Label $label)
    {
        $this->authorizeLabel($label);
        return response()->json($label, 200);
    }

    /**
     * Update the specified label if it belongs to the authenticated user.
     */
    public function update(Request $request, Label $label)
    {
        $this->authorizeLabel($label);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
        ]);

        $label->update($validated);

        return response()->json($label, 200);
    }

    /**
     * Remove the specified label if it belongs to the authenticated user.
     */
    public function destroy(Label $label)
    {
        $this->authorizeLabel($label);
        $label->delete();

        return response()->json(null, 204);
    }

    /**
     * Ensure the label belongs to the authenticated user.
     */
    protected function authorizeLabel(Label $label)
    {
        if ($label->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
    }
}
