<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>

<h3>{{ strtoupper(str_replace('-', ' ', $reportId)) }}</h3>
<p>Month: {{ $month }} | Year: {{ $year }}</p>

@php
    // 🔹 Normalize data (object → collection)
    if (is_object($data)) {
        $data = collect([$data]);
    }
@endphp

@if($data->isEmpty())
    <p>No data available for this report.</p>
@else
<table>
    <thead>
        <tr>
            @foreach(array_keys((array) $data->first()) as $head)
                <th>{{ ucfirst(str_replace('_',' ', $head)) }}</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach($data as $row)
            <tr>
                @foreach((array) $row as $cell)
                    <td>{{ $cell }}</td>
                @endforeach
            </tr>
        @endforeach
    </tbody>
</table>
@endif

</body>
</html>
