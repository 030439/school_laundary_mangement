<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /* ===================== DASHBOARD STATS ===================== */
    public function stats()
    {
        $month = now()->month;
        $year  = now()->year;

        $totalStudents = DB::table('students')
            ->where('status', 'active')
            ->count();

        $pocketMoneyGiven = DB::table('pocket_money_transactions')
            ->where('month', $month)
            ->where('year', $year)
            ->sum('amount_given');

        $totalPocketMoney = DB::table('students')
            ->where('status', 'active')
            ->sum('monthlyPocketMoney');

        $remainingPocketMoney = max(
            $totalPocketMoney - $pocketMoneyGiven,
            0
        );

        $clothesWashed = DB::table('laundry_records')
            ->whereMonth('record_date', $month)
            ->whereYear('record_date', $year)
            ->sum('clothes_count');

        $laundryCost = DB::table('laundry_records')
            ->whereMonth('record_date', $month)
            ->whereYear('record_date', $year)
            ->sum('total_amount');

        return response()->json([
            'totalStudents' => $totalStudents,
            'pocketMoneyGivenThisMonth' => (float) $pocketMoneyGiven,
            'pocketMoneyRemaining' => (float) $remainingPocketMoney,
            'clothesWashedThisMonth' => (int) $clothesWashed,
            'monthlyLaundryCost' => (float) $laundryCost,
        ]);
    }

    /* ===================== POCKET MONEY CHART ===================== */
    public function pocketMoneyChart()
    {
        $year = now()->year;

        $data = [];

        for ($m = 1; $m <= 12; $m++) {
            $given = DB::table('pocket_money_transactions')
                ->where('month', $m)
                ->where('year', $year)
                ->sum('amount_given');

            $monthlyTotal = DB::table('students')
                ->where('status', 'active')
                ->sum('monthlyPocketMoney');

            $data[] = [
                'month' => Carbon::create()->month($m)->format('M'),
                'given' => (float) $given,
                'remaining' => max($monthlyTotal - $given, 0),
            ];
        }

        return response()->json($data);
    }

    /* ===================== LAUNDRY CHART ===================== */
    public function laundryChart()
    {
        $year = now()->year;

        $data = [];

        for ($m = 1; $m <= 12; $m++) {
            $clothes = DB::table('laundry_records')
                ->whereMonth('record_date', $m)
                ->whereYear('record_date', $year)
                ->sum('clothes_count');

            $cost = DB::table('laundry_records')
                ->whereMonth('record_date', $m)
                ->whereYear('record_date', $year)
                ->sum('total_amount');

            $data[] = [
                'month' => Carbon::create()->month($m)->format('M'),
                'clothes' => (int) $clothes,
                'cost' => (float) $cost,
            ];
        }

        return response()->json($data);
    }
}
