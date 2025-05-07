<?php

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Movement;
use Illuminate\Support\Facades\Route;

define("INCOME_ID", 1);
define("EXPENSE_ID", 2);

function retrieveLastFourMonthsData($userId)
{
    $fullData = [];
    $currentMonthData = null;

    for ($i = 3; $i >= 0; $i--) {
        $date = Carbon::now()->subMonths($i);
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $income = Movement::where('user_id', $userId)
            ->where('movement_type_id', INCOME_ID)
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $expenses = Movement::where('user_id', $userId)
            ->where('movement_type_id', EXPENSE_ID)
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $monthData = [
            'date' => $date->format('F'),
            'Income' => $income,
            'Expenses' => $expenses
        ];

        $fullData[] = $monthData;
        if ($i === 0) $currentMonthData = $monthData;
    }

    return [
        'currentMonthData' => $currentMonthData,
        'fullData' => $fullData
    ];
}

Route::get('/', function () {
    return Inertia::render("Home");
});

Route::get('/dashboard/{id}', function ($id) {

    $balance = Movement::where('user_id', $id)
        ->latest('transaction_date')
        ->value('balance');

    $recentMovements = Movement::where('user_id', $id)
        ->orderBy('transaction_date', 'desc')
        ->limit(8)
        ->get();

    $data = retrieveLastFourMonthsData($id);
    $currentMonthData = $data['currentMonthData'];
    $currentMonthData['Balance'] = $balance;

    return Inertia::render('Dashboard', [
        'lastFourMonthsData' => $data['fullData'],
        'currentMonthData' => $currentMonthData,
        'recentMovements' => $recentMovements
    ]);
});
