<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'student_code','name','class','section',
        'parent_name','monthly_pocket_money','status'
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

