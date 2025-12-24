<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {

    Route::resource('students', StudentController::class);

    Route::post('pocket-money', [PocketMoneyController::class, 'store']);
    Route::get('pocket-money/report', [PocketMoneyController::class, 'monthlyReport']);

    Route::resource('laundry-staff', LaundryStaffController::class);
    Route::post('laundry-records', [LaundryController::class, 'store']);
    Route::get('laundry/report', [LaundryController::class, 'monthlyReport']);
});
