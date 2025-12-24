<?php

namespace App\Http\Controllers;

use App\Models\PocketMoneyTransaction;
use App\Models\Student;
use Illuminate\Http\Request;

class PocketMoneyController extends Controller
{
    public function store(Request $request)
    {
        $record = PocketMoneyTransaction::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Pocket money added',
            'data' => $record
        ]);
    }

    public function monthlyReport(Request $request)
    {
        $month = $request->month;
        $year  = $request->year;

        $students = Student::withSum(
            ['pocketMoney as total_given' => function ($q) use ($month, $year) {
                $q->where('month', $month)->where('year', $year);
            }],
            'amount'
        )->get();

        $report = $students->map(function ($s) {
            return [
                'student_id' => $s->id,
                'name' => $s->name,
                'monthly_pocket_money' => $s->monthly_pocket_money,
                'given' => $s->total_given ?? 0,
                'remaining' => $s->monthly_pocket_money - ($s->total_given ?? 0),
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $report
        ]);
    }
}
