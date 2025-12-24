<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PocketMoneyTransaction extends Model
{
    protected $fillable = [
        'student_id','amount','month','year',
        'transaction_date','remarks'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}

