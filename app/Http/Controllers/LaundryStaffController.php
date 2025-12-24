<?php

namespace App\Http\Controllers;

use App\Models\LaundryStaff;
use Illuminate\Http\Request;

class LaundryStaffController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => LaundryStaff::all()
        ]);
    }

    public function store(Request $request)
    {
        $staff = LaundryStaff::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Laundry staff added',
            'data' => $staff
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'status' => true,
            'data' => LaundryStaff::findOrFail($id)
        ]);
    }

    public function update(Request $request, $id)
    {
        LaundryStaff::findOrFail($id)->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Laundry staff updated'
        ]);
    }

    public function destroy($id)
    {
        LaundryStaff::findOrFail($id)->delete();

        return response()->json([
            'status' => true,
            'message' => 'Laundry staff deleted'
        ]);
    }
}
