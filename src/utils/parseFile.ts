import * as XLSX from 'xlsx';
import type { ParsedColumn, SheetMapperError } from '../types';

const ACCEPTED_TYPES = new Set([
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
    '',
]);

function isAccepted(file: File): boolean {
    if (ACCEPTED_TYPES.has(file.type)) return true;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    return ['csv', 'xls', 'xlsx'].includes(ext);
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target!.result as ArrayBuffer);
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Parse an Excel/CSV file into an array of ParsedColumn objects.
 * The first row is used as the column name; remaining rows are data.
 * Entirely empty columns (all blank) are dropped.
 */
export async function parseFile(file: File): Promise<ParsedColumn[]> {
    if (!isAccepted(file)) {
        throw {
            code: 'INVALID_FILE_TYPE',
            message: 'Invalid file type.',
        } satisfies SheetMapperError;
    }

    let buffer: ArrayBuffer;
    try {
        buffer = await readFileAsArrayBuffer(file);
    } catch {
        throw { code: 'FILE_READ_ERROR', message: 'Could not read file.' } satisfies SheetMapperError;
    }

    const workbook = XLSX.read(buffer, { type: 'array', raw: false });

    if (!workbook.SheetNames.length) {
        throw { code: 'NO_WORKSHEET', message: 'No worksheets found.' } satisfies SheetMapperError;
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
        header: 1,
        defval: '',
        blankrows: false,
        raw: false,
    });

    if (rows.length === 0) {
        throw { code: 'EMPTY_WORKSHEET', message: 'The worksheet is empty.' } satisfies SheetMapperError;
    }

    // Transpose: rows → columns
    const maxCols = Math.max(...rows.map((r) => r.length));
    const columns: ParsedColumn[] = [];

    for (let c = 0; c < maxCols; c++) {
        const allValues = rows.map((row) => String(row[c] ?? ''));
        const name = allValues[0] ?? '';
        const data = allValues.slice(1);

        // Drop columns where every data cell is empty
        if (data.every((v) => v === '')) continue;

        columns.push({ name, data });
    }

    if (columns.length === 0) {
        throw { code: 'EMPTY_WORKSHEET', message: 'The worksheet is empty.' } satisfies SheetMapperError;
    }

    return columns;
}
