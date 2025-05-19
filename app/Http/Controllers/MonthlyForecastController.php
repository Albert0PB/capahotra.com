<?php

namespace App\Http\Controllers;

use App\Models\MonthlyForecast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MonthlyForecastController extends Controller
{
    /**
     * Display a listing of the user's forecasts (optionally by year/month).
     */
    public function index(Request $request)
    {
        $query = MonthlyForecast::where('user_id', Auth::id());

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('month')) {
            $query->where('month', $request->month);
        }

        return response()->json($query->get(), 200);
    }

    /**
     * Store a newly created forecast.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label_id' => 'required|exists:labels,id',
            'year'     => 'required|integer|min:2000|max:2100',
            'month'    => 'required|integer|min:1|max:12',
            'amount'   => 'required|numeric|min:0',
            'comment'  => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = Auth::id();

        $forecast = MonthlyForecast::create($validated);

        return response()->json($forecast, 201);
    }

    /**
     * Display the specified forecast.
     */
    public function show(MonthlyForecast $monthlyForecast)
    {
        $this->authorizeForecast($monthlyForecast);

        return response()->json($monthlyForecast, 200);
    }

    /**
     * Update the specified forecast.
     */
    public function update(Request $request, MonthlyForecast $monthlyForecast)
    {
        try {
            $this->authorizeForecast($monthlyForecast);

            $validated = $request->validate([
                'label_id' => 'sometimes|required|exists:labels,id',
                'year'     => 'sometimes|required|integer|min:2000|max:2100',
                'month'    => 'sometimes|required|integer|min:1|max:12',
                'amount'   => 'sometimes|required|numeric|min:0',
                'comment'  => 'nullable|string|max:255',
            ]);

            $monthlyForecast->update($validated);

            return response()->json($monthlyForecast, 200);
        } catch (\Throwable $e) {
            Log::error('Update error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified forecast.
     */
    public function destroy(MonthlyForecast $monthlyForecast)
    {
        $this->authorizeForecast($monthlyForecast);
        $monthlyForecast->delete();

        return response()->json(null, 204);
    }

    /**
     * Ensure the forecast belongs to the authenticated user.
     */
    protected function authorizeForecast(MonthlyForecast $forecast)
    {
        if ($forecast->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
    }
}
