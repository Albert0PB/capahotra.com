<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Label;
use App\Models\Bank;
use App\Models\MovementType;

class Movement extends Model
{
    /** @use HasFactory<\Database\Factories\MovementFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label_id',
        'movement_type_id',
        'bank_id',
        'amount',
        'transaction_date',
        'value_date',
        'comment',
        'balance',
    ];

    public function label()
    {
        return $this->belongsTo(Label::class);
    }

    public function bank()
    {
        return $this->belongsTo(Bank::class);
    }

    public function movementType()
    {
        return $this->belongsTo(MovementType::class);
    }
}
