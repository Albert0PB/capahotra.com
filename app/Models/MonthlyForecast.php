<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Label;

class MonthlyForecast extends Model
{
    /** @use HasFactory<\Database\Factories\MonthlyForecastFactory> */
    use HasFactory;

    public function label()
    {
        return $this->belongsTo(Label::class);
    }

    protected $fillable = [
        'label_id',
        'user_id',
        'year',
        'month',
        'amount',
        'comment',
    ];
}
