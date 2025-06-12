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

    protected $casts = [
        'transaction_date' => 'date',
        'value_date' => 'date',
        'amount' => 'decimal:2',
        'balance' => 'decimal:2',
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

    /**
     * Get the bank name or return a default for cash operations
     */
    public function getBankNameAttribute()
    {
        return $this->bank ? $this->bank->name : 'Efectivo';
    }

    /**
     * Check if this is a cash movement (no bank associated)
     */
    public function getIsCashMovementAttribute()
    {
        return is_null($this->bank_id);
    }
}