<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Carbon\Carbon;
use App\Models\PocketMoneyTransaction;

class PocketMoneyController extends Controller
{
    // Fetch all transactions (filter by month/year)
    public function index(Request $request)
    {
        $month = $request->query('month');
        $year = $request->query('year');

        $transactions = PocketMoneyTransaction::with('student')
            ->when($month, fn($q) => $q->whereMonth('date', date('m', strtotime("1 $month"))))
            ->when($year, fn($q) => $q->whereYear('date', $year))
            ->orderByDesc('date')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'studentId' => $t->student_id,
                'studentName' => $t->student->name,
                'month' => $t->date,
                'year' => $t->date,
                'assigned' => $t->student->monthly_pocket_money??0,
                'given' => $t->amount_given,
                'date' => $t->date,
                'notes' => $t->notes,
            ]);

        return response()->json(['success' => true, 'data' => $transactions]);
    }

    // Add a transaction
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount_given' => 'required|numeric',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

            $date = $request->date;

            // Create a Carbon instance
            $carbonDate = Carbon::parse($date);

            // Get the month number (1-12)
            $month = $carbonDate->month;
            $year = $carbonDate->year;


        $student = Student::find($request->student_id);

        $transaction = PocketMoneyTransaction::create([
            'student_id' => $student->id,
            'amount_given' => $request->amount_given,
            'date' => $request->date,
            'month' => $month,
            'year'=>$year,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pocket money transaction recorded',
            'data' => [
                'id' => $transaction->id,
                'studentId' => $student->id,
                'studentName' => $student->name,
                'month' => date('F', strtotime($transaction->date)),
                'year' => date('Y', strtotime($transaction->date)),
                'amountAssigned' => $student->monthly_pocket_money,
                'amountGiven' => $transaction->amount_given,
                'date' => $transaction->date,
                'notes' => $transaction->notes,
            ]
        ]);
    }

    // Update a transaction
    public function update(Request $request, $id)
    {
        $request->validate([
            'amount_given' => 'required|numeric',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $transaction = PocketMoneyTransaction::findOrFail($id);
        $transaction->update([
            'amount_given' => $request->amount_given,
            'date' => $request->date,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaction updated successfully',
        ]);
    }

    // Delete a transaction
    public function destroy($id)
    {
        $transaction = PocketMoneyTransaction::findOrFail($id);
        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfully',
        ]);
    }

    // Student summary for selected month
    public function studentSummary(Request $request)
    {
        $month = $request->query('month');
        $year = $request->query('year');

        $students = Student::all();

        $summary = $students->map(function ($student) use ($month, $year) {
            $transactions = $student->transactions()
                ->when($month, fn($q) => $q->whereMonth('date', date('m', strtotime("1 $month"))))
                ->when($year, fn($q) => $q->whereYear('date', $year))
                ->get();

            $totalGiven = $transactions->sum('amount_given');
            
            $remaining = abs($student->monthly_pocket_money - $totalGiven);

            return [
                'id' => $student->id,
                'studentId' => $student->student_id ?? $student->id, // fallback if studentId null
                'name' => $student->name,
                'class' => $student->class . ' - ' . $student->section,
                'assigned' => $student->monthly_pocket_money ?? 0, // fallback if null
                'given' => $totalGiven,
                'remaining' => $remaining,
                'transactionCount' => $transactions->count(),
            ];
        });

        return response()->json(['success' => true, 'data' => $summary]);
    }


   
}

    // public function store(Request $request)
    // {
    //     $record = PocketMoneyTransaction::create($request->all());

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Pocket money added',
    //         'data' => $record
    //     ]);
    // }

    

