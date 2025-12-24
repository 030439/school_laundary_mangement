<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'studentId','name','class','section',
        'parentName','monthlyPocketMoney','status'
    ];

    public function pocketMoney()
    {
        return $this->hasMany(PocketMoneyTransaction::class);
    }

    public function laundryRecords()
    {
        return $this->hasMany(LaundryRecord::class);
    }
}

