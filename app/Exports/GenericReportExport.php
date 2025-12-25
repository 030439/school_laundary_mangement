<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class GenericReportExport implements FromCollection, WithHeadings
{
    protected Collection $data;

    public function __construct($data)
    {
        // normalize object → collection
        if (is_object($data)) {
            $data = collect([$data]);
        }

        $this->data = collect($data);
    }

    /**
     * Data rows
     */
    public function collection()
    {
        return $this->data->map(function ($row) {
            return (array) $row;
        });
    }

    /**
     * Excel headings
     */
    public function headings(): array
    {
        if ($this->data->isEmpty()) {
            return [];
        }

        return array_map(
            fn ($h) => ucfirst(str_replace('_', ' ', $h)),
            array_keys((array) $this->data->first())
        );
    }
}
