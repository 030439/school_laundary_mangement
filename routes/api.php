<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\PocketMoneyController;
use App\Http\Controllers\LaundryController;
use App\Http\Controllers\LaundryStaffController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // students
    Route::apiResource('students', StudentController::class);

    // pocket money
    // Route::post('pocket-money', [PocketMoneyController::class, 'store']);
    // Route::get('pocket-money/report', [PocketMoneyController::class, 'monthlyReport']);
    
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