<?php

namespace App\Http\Controllers;

use App\Models\LaundryRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaundryController extends Controller
{

    public function index(Request $request)
    {
        $month = $request->month;
        $year  = $request->year;

        $records = LaundryRecord::join(
            'laundry_staff',
            'laundry_records.staff_id',
            '=',
            'laundry_staff.id'
        )
        ->leftJoin(
            'students',
            'laundry_records.student_id',
            '=',
            'students.id'
        )
        ->whereMonth('laundry_records.record_date', $month)
        ->whereYear('laundry_records.record_date', $year)
        ->orderBy('laundry_records.record_date', 'desc')
        ->select([
            'laundry_records.id',
            'laundry_records.student_id',
            'students.name as student_name',
            'laundry_records.record_date',
            'laundry_records.clothes_count',
            'laundry_staff.name as dhobi_name',   // ✅ FIX
            'laundry_records.rate_per_cloth',
            'laundry_records.total_amount',
        ])
        ->get()
        ->map(function ($r) {
            return [
                'id' => $r->id,
                'studentId' => $r->student_id,
                'studentName' => $r->student_name ?? '',
                'date' => $r->record_date,
                'numberOfClothes' => (int) $r->clothes_count,
                'dhobiName' => $r->dhobi_name ?? 'N/A', // ✅
                'costPerCloth' => (float) $r->rate_per_cloth,
                'totalAmount' => (float) $r->total_amount,
            ];
        });


        return response()->json([
            'status' => true,
            'data' => $records
        ]);
    }

    public function dhobiSummary(Request $request)
{
    $month = $request->month;
    $year  = $request->year;

    if (!$month || !$year) {
        return response()->json([
            'status' => false,
            'message' => 'Month and year are required'
        ], 422);
    }

    $data = DB::table('laundry_records as c')
        ->select(
            's.name as name',
            DB::raw('SUM(c.clothes_count) as totalClothes'),
            DB::raw('SUM(c.total_amount) as totalCost'),
            DB::raw('COUNT(c.id) as entryCount')
        )
        ->join('laundry_staff as s', 'c.staff_id', '=', 's.id')
        ->whereMonth('c.record_date', $month)
        ->whereYear('c.record_date', $year)
        ->groupBy('s.name')
        ->havingRaw('COUNT(c.id) > 0')
        ->orderBy('s.name')
        ->get();

    return response()->json([
        'status' => true,
        'data' => $data
    ]);
}


    public function studentLaundrySummary(Request $request)
{
    $month = $request->month;
    $year  = $request->year;

    $data = DB::table('laundry_records as l')
        ->join('students as s', 's.id', '=', 'l.student_id')
        ->select(
            's.id',
            's.studentId',
            's.name',
            DB::raw("CONCAT(s.class,' - ',s.section) as class"),
            DB::raw('SUM(l.clothes_count) as totalClothes'),
            DB::raw('SUM(l.total_amount) as totalCost'),
            DB::raw('COUNT(l.id) as entryCount')
        )
        ->whereMonth('l.record_date', $month)
        ->whereYear('l.record_date', $year)
        ->groupBy('s.id','s.studentId','s.name','s.class','s.section')
        ->get();

    return response()->json([
        'status' => true,
        'data' => $data
    ]);
}



    public function store(Request $request)
    {
        $total = $request->clothes_count * $request->rate_per_cloth;

        $record = LaundryRecord::create([
            'student_id' => $request->student_id,
            'staff_id' => $request->staff_id,
            'clothes_count' => $request->clothes_count,
            'rate_per_cloth' => $request->rate_per_cloth,
            'total_amount' => $total,
            'record_date' => $request->date,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Laundry record saved',
            'data' => $record
        ]);
    }

    public function monthlyReport(Request $request)
    {
        $month = $request->month;
        $year  = $request->year;

        $report = LaundryRecord::selectRaw('
                staff_id,
                SUM(clothes_count) as total_clothes,
                SUM(total_amount) as total_amount
            ')
            ->whereMonth('record_date', $month)
            ->whereYear('record_date', $year)
            ->groupBy('staff_id')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $report
        ]);
    }
}
