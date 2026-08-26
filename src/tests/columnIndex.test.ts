// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { useSheetMapper } from '../composables/useSheetMapper';
import type { SchemaField } from '../types';

const fields: SchemaField[] = [
    { key: 'DESCRIPCION', label: 'Descripcion' },
    { key: 'VENTA', label: 'Venta' },
    { key: 'COSTO', label: 'Costo' },
];

// A = DESCRIPCION, B = NOTAS (header only, no data), C = VENTA, D = COSTO.
// parseFile drops B because every data cell is empty.
const rows = [
    ['DESCRIPCION', 'NOTAS', 'VENTA', 'COSTO'],
    ['Tornillo', '', '1200', '800'],
    ['Tuerca', '', '300', '150'],
];

function makeFile(data: string[][], name = 'test.xlsx'): File {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), 'Hoja1');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
    return new File([buf], name, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
}

describe('spreadsheet column index', () => {
    it('mapping uses the real sheet index, not the position in the columns array', async () => {
        const mapper = useSheetMapper(fields);
        await mapper.loadFile(makeFile(rows));

        // The empty NOTAS column never reaches the UI…
        expect(mapper.columns.value.map((c) => c.name)).toEqual(['DESCRIPCION', 'VENTA', 'COSTO']);

        // …but it does not shift the indexes sent to the backend.
        expect(mapper.mapping.value).toEqual({
            0: 'DESCRIPCION',
            2: 'VENTA',
            3: 'COSTO',
        });
    });

    it('toggleHeaders preserves col.index', async () => {
        const mapper = useSheetMapper(fields);
        await mapper.loadFile(makeFile(rows));

        const before = mapper.mapping.value;

        mapper.toggleHeaders(); // headers → data rows
        mapper.toggleHeaders(); // data rows → headers again

        expect(mapper.columns.value.map((c) => c.index)).toEqual([0, 2, 3]);
        expect(mapper.mapping.value).toEqual(before);
    });
});
