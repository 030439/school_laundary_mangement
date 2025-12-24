<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PocketMoneyTransaction extends Model
{
    protected $fillable = [
        'student_id','amount_given','month','year',
        'date','remarks'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

}

