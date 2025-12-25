<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\PocketMoneyController;
use App\Http\Controllers\LaundryController;
use App\Http\Controllers\LaundryStaffController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    //dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/pocket-money-chart', [DashboardController::class, 'pocketMoneyChart']);
    Route::get('/dashboard/laundry-chart', [DashboardController::class, 'laundryChart']);

    //reports
    Route::get('/reports/{reportId}', [ReportController::class, 'show']);
    Route::get('/reports/{reportId}/export/pdf', [ReportController::class, 'exportPdf']);
    Route::get('/reports/{reportId}/export/excel', [ReportController::class, 'exportExcel']);

    Route::get('/reports/{reportId}/print', [ReportController::class, 'print']);

    // students
    Route::apiResource('students', StudentController::class);
    // Pocket Money Transactions
    Route::get('/pocket-money-transactions', [PocketMoneyController::class, 'index']);
    Route::post('/pocket-money-transactions', [PocketMoneyController::class, 'store']);
    Route::put('/pocket-money-transactions/{id}', [PocketMoneyController::class, 'update']);
    Route::delete('/pocket-money-transactions/{id}', [PocketMoneyController::class, 'destroy']);
    // Pocket Money Summary
    Route::get('/pocket-money/student-summary', [PocketMoneyController::class, 'studentSummary']);
    // laundry
    Route::apiResource('laundry-staff', LaundryStaffController::class);
    Route::post('laundry-records', [LaundryController::class, 'store']);
    Route::get('laundry/report', [LaundryController::class, 'monthlyReport']);
    Route::get('laundry', [LaundryController::class, 'index']);
    Route::get('reports/student-laundry-summary', [LaundryController::class, 'studentLaundrySummary']);
    Route::get('reports/laundry/dhobi-summary', [LaundryController::class, 'dhobiSummary']);

});