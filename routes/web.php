<?php

use Illuminate\Support\Facades\DB;
use willvincent\Feeds\Facades\FeedsFacade as Feeds;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use App\Models\Movement;
use App\Models\Label;
use App\Models\MonthlyForecast;

use App\Http\Controllers\LabelController;
use App\Http\Controllers\MovementController;
use App\Http\Controllers\MonthlyForecastController;

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

function getFinancialNews(int $limit = 5): array
{
    $feedUrl = 'https://www.cnbc.com/id/100003114/device/rss/rss.html';
    $feed = Feeds::make($feedUrl);
    $items = $feed->get_items(0, $limit);
    $link = $feed->get_permalink();
    $host = parse_url($link, PHP_URL_HOST);

    $news = [];

    foreach ($items as $item) {
        $enclosure = $item->get_enclosure();
        $image = $enclosure ? $enclosure->get_link() : null;

        $news[] = [
            'title'       => $item->get_title(),
            'description' => $item->get_description(),
            'link'        => $item->get_permalink(),
            'date'        => $item->get_date('Y-m-d H:i:s'),
            'image'       => $image,
            'source'     => str_replace('www.', '', $host)
        ];
    }

    return $news;
}

function getLabelsData()
{
    $yearStart = now()->startOfYear();
    $labels = Label::withSum([
        'movements' => function ($query) use ($yearStart) {
            $query->where('transaction_date', '>=', $yearStart);
        }
    ], 'amount')
        ->withCount([
            'movements' => function ($query) use ($yearStart) {
                $query->where('transaction_date', '>=', $yearStart);
            }
        ])
        ->where('user_id', Auth::id())
        ->get();

    return $labels;
}

Route::fallback(function () {
    return Inertia::render('NotFound')->toResponse(request())->setStatusCode(404);
});

Route::middleware('auth')->prefix('/api')->group(function () {
    Route::apiResource('labels', LabelController::class);
    Route::apiResource('movements', MovementController::class);
    Route::apiResource('monthly-forecasts', MonthlyForecastController::class);

    Route::get('monthly-forecasts-summary', function () {
        try {
            $userId = Auth::id();

            Log::info("Fetching forecast summary for user_id: $userId");

            $summary = DB::table('monthly_forecasts')
                ->join('labels', 'monthly_forecasts.label_id', '=', 'labels.id')
                ->leftJoin('movements', function ($join) {
                    $join->on('monthly_forecasts.label_id', '=', 'movements.label_id')
                        ->on('monthly_forecasts.year', '=', DB::raw('YEAR(movements.transaction_date)'))
                        ->on('monthly_forecasts.month', '=', DB::raw('MONTH(movements.transaction_date)'));
                })
                ->select(
                    'labels.name as label',
                    'labels.id as label_id',
                    'monthly_forecasts.year',
                    'monthly_forecasts.month',
                    'monthly_forecasts.amount as forecasted_amount',
                    DB::raw('COALESCE(SUM(movements.amount), 0) as executed_amount'),
                    'monthly_forecasts.comment'
                )
                ->where('monthly_forecasts.user_id', $userId)
                ->groupBy(
                    'labels.name',
                    'labels.id',
                    'monthly_forecasts.year',
                    'monthly_forecasts.month',
                    'monthly_forecasts.amount',
                    'monthly_forecasts.comment'
                )
                ->orderBy('monthly_forecasts.year')
                ->orderBy('monthly_forecasts.month')
                ->get();

            $summary = $summary->map(function ($item) {
                $item->forecasted_amount = (float) $item->forecasted_amount;
                $item->executed_amount = (float) $item->executed_amount;
                $item->completion = $item->forecasted_amount > 0
                    ? round(($item->executed_amount / $item->forecasted_amount) * 100, 2)
                    : 0;
                return $item;
            });

            return response()->json($summary);
        } catch (\Throwable $e) {
            Log::error('Error in monthly-forecasts-summary:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    });
});


Route::get('/', function () {
    return Inertia::render("Home");
});

Route::middleware(['auth',])->get('/dashboard', function () {
    $userId = Auth::id();

    $balance = Movement::where('user_id', $userId)
        ->latest('transaction_date')
        ->value('balance');

    $recentMovements = Movement::where('user_id', $userId)
        ->orderBy('transaction_date', 'desc')
        ->limit(8)
        ->get();

    $data = retrieveLastFourMonthsData($userId);
    $currentMonthData = $data['currentMonthData'];
    $currentMonthData['Balance'] = $balance;

    return Inertia::render('Dashboard', [
        'lastFourMonthsData' => $data['fullData'],
        'currentMonthData' => $currentMonthData,
        'recentMovements' => $recentMovements,
        'financialNews' => getFinancialNews(3),
    ]);
});

Route::middleware('auth')->prefix('/operations')->group(function () {
    Route::get("labels", function () {
        $user = Auth::user();

        $userLabels = $user->labels()->get();

        $labelsData = getLabelsData($user->id);

        return Inertia::render('Operations/OpLabels', [
            'labelsData' => $labelsData,
            'userLabels' => $userLabels,
        ]);
    });

    Route::get("monthly-forecasts", function () {
        $user = Auth::user();

        $forecasts = $user->monthlyForecasts()->with('label')->get();
        $userLabels = $user->labels()->get();

        return Inertia::render('Operations/OpMonthlyForecasts', [
            'monthlyForecasts' => $forecasts,
            'userLabels' => $userLabels,
        ]);
    });


    Route::get("movements", function () {});
});
