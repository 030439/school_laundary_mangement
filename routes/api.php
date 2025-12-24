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
    Route::post('pocket-money', [PocketMoneyController::class, 'store']);
    Route::get('pocket-money/report', [PocketMoneyController::class, 'monthlyReport']);

    // laundry
    Route::apiResource('laundry-staff', LaundryStaffController::class);
    Route::post('laundry-records', [LaundryController::class, 'store']);
    Route::get('laundry/report', [LaundryController::class, 'monthlyReport']);
     Route::get('laundry', [LaundryController::class, 'index']);
});