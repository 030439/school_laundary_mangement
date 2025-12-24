<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => Student::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $student = Student::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Student created',
            'data' => $student
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'status' => true,
            'data' => Student::findOrFail($id)
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $student->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Student updated'
        ]);
    }

    public function destroy($id)
    {
        Student::findOrFail($id)->delete();

        return response()->json([
            'status' => true,
            'message' => 'Student deleted'
        ]);
    }
}
