<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bank extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'transaction_date_field',
        'value_date_field',
        'label_field',
        'amount_field',
        'balance_field',
    ];

}
