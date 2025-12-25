<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\GenericReportExport;
use DB;

class ReportController extends Controller
{
    /* ================= CORE DATA ================= */

    private function getReportData($reportId, $month, $year)
    {
        switch ($reportId) {

            /* ================= POCKET MONEY ================= */

            // 1️⃣ Monthly Pocket Money Summary
            case 'pocket-money-monthly':
                return DB::table('pocket_money_transactions')
                    ->selectRaw('
                        SUM(amount_given) as total_given,
                        COUNT(DISTINCT student_id) as students
                    ')
                    ->where('month', $month)
                    ->where('year', $year)
                    ->first();

            // 2️⃣ Outstanding Pocket Money
            case 'pocket-money-outstanding':
                return DB::table('students as s')
                    ->leftJoin('pocket_money_transactions as p', function ($join) use ($month, $year) {
                        $join->on('s.id', '=', 'p.student_id')
                            ->where('p.month', $month)
                            ->where('p.year', $year);
                    })
                    ->select(
                        's.studentId',
                        's.name',
                        's.monthlyPocketMoney',
                        DB::raw('COALESCE(SUM(p.amount_given),0) as given_amount'),
                        DB::raw('(s.monthlyPocketMoney - COALESCE(SUM(p.amount_given),0)) as remaining')
                    )
                    ->groupBy('s.id', 's.studentId', 's.name', 's.monthlyPocketMoney')
                    ->havingRaw('remaining > 0')
                    ->get();

            /* ================= LAUNDRY ================= */

            // 3️⃣ Monthly Laundry Summary
            case 'laundry-monthly':
                return DB::table('laundry_records')
                    ->selectRaw('
                        COUNT(id) as total_entries,
                        SUM(clothes_count) as total_clothes,
                        SUM(total_amount) as total_cost
                    ')
                    ->whereMonth('record_date', $month)
                    ->whereYear('record_date', $year)
                    ->first();

            // 4️⃣ Laundry Cost Breakdown
            case 'laundry-cost':
                return DB::table('laundry_records')
                    ->selectRaw('
                        DATE(record_date) as date,
                        SUM(total_amount) as cost
                    ')
                    ->whereMonth('record_date', $month)
                    ->whereYear('record_date', $year)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();

            // 5️⃣ Dhobi (Laundry Staff) Summary
            case 'dhobi-summary':
                return DB::table('laundry_records as l')
                    ->join('laundry_staff as s', 's.id', '=', 'l.staff_id')
                    ->select(
                        's.name',
                        DB::raw('SUM(l.clothes_count) as total_clothes'),
                        DB::raw('SUM(l.total_amount) as total_earning')
                    )
                    ->whereMonth('l.record_date', $month)
                    ->whereYear('l.record_date', $year)
                    ->groupBy('s.name')
                    ->get();

            /* ================= STUDENT FULL ================= */

            // 6️⃣ Student Complete Report
            case 'student-full':
                return DB::table('students as s')
                    ->leftJoin('pocket_money_transactions as p', function ($join) use ($month, $year) {
                        $join->on('s.id', '=', 'p.student_id')
                            ->where('p.month', $month)
                            ->where('p.year', $year);
                    })
                    ->leftJoin('laundry_records as l', function ($join) use ($month, $year) {
                        $join->on('s.id', '=', 'l.student_id')
                            ->whereMonth('l.record_date', $month)
                            ->whereYear('l.record_date', $year);
                    })
                    ->select(
                        's.studentId',
                        's.name',
                        's.monthlyPocketMoney',
                        DB::raw('COALESCE(SUM(DISTINCT p.amount_given),0) as pocket_given'),
                        DB::raw('COALESCE(SUM(l.total_amount),0) as laundry_cost')
                    )
                    ->groupBy('s.id', 's.studentId', 's.name', 's.monthlyPocketMoney')
                    ->get();

            default:
                abort(404, 'Invalid report');
        }
    }

    /* ================= API VIEW ================= */

    public function show(Request $request, $reportId)
    {
        return response()->json([
            'success' => true,
            'data' => $this->getReportData(
                $reportId,
                $request->month,
                $request->year
            )
        ]);
    }

    /* ================= PDF ================= */

    public function exportPdf(Request $request, $reportId)
    {
        $data = $this->getReportData($reportId, $request->month, $request->year);

        $pdf = Pdf::loadView('reports.pdf', [
            'data' => $data,
            'reportId' => $reportId,
            'month' => $request->month,
            'year' => $request->year
        ]);

        return $pdf->download("{$reportId}-{$request->month}-{$request->year}.pdf");
    }

    /* ================= EXCEL ================= */

    public function exportExcel(Request $request, $reportId)
    {
        $data = $this->getReportData($reportId, $request->month, $request->year);

        return Excel::download(
            new GenericReportExport($data),
            "{$reportId}-{$request->month}-{$request->year}.xlsx"
        );
    }

    /* ================= PRINT ================= */

    public function print(Request $request, $reportId)
    {
        return view('reports.print', [
            'data' => $this->getReportData(
                $reportId,
                $request->month,
                $request->year
            ),
            'reportId' => $reportId,
            'month' => $request->month,
            'year' => $request->year
        ]);
    }
}
