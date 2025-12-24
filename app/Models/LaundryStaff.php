<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaundryStaff extends Model
{
    protected $fillable = ['name','phone','per_cloth_rate','status'];

    public function laundryRecords()
    {
        return $this->hasMany(LaundryRecord::class, 'staff_id');
    }
}

