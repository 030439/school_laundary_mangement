<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\PocketMoneyController;
use App\Http\Controllers\LaundryController;
use App\Http\Controllers\LaundryStaffController;

Route::prefix('admin')->group(function () {

    Route::apiResource('students', StudentController::class);

    Route::post('pocket-money', [PocketMoneyController::class, 'store']);
    Route::get('pocket-money/report', [PocketMoneyController::class, 'monthlyReport']);

    Route::apiResource('laundry-staff', LaundryStaffController::class);
    Route::post('laundry-records', [LaundryController::class, 'store']);
    Route::get('laundry/report', [LaundryController::class, 'monthlyReport']);
});
