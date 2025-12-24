<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaundryRecord extends Model
{
    protected $fillable = [
        'student_id','staff_id','clothes_count',
        'rate_per_cloth','total_amount','record_date'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function staff()
    {
        return $this->belongsTo(LaundryStaff::class, 'staff_id');
    }
}

