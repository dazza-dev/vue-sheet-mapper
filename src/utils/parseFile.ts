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

/** Zip header (.xlsx) or OLE compound file header (.xls). */
function isBinaryWorkbook(bytes: Uint8Array): boolean {
    if (bytes[0] === 0x50 && bytes[1] === 0x4b) return true;
    return bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
}

/**
 * Decodes a text file: byte order mark first, then an explicit label, then
 * strict UTF-8, falling back to Windows-1252.
 */
function decodeText(bytes: Uint8Array, encoding?: string): string {
    if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes);
    if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes);
    if (encoding) return new TextDecoder(encoding).decode(bytes);

    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
        return new TextDecoder('windows-1252').decode(bytes);
    }
}

function readWorkbook(buffer: ArrayBuffer, encoding?: string): XLSX.WorkBook {
    const bytes = new Uint8Array(buffer);
    return isBinaryWorkbook(bytes)
        ? XLSX.read(buffer, { type: 'array', raw: false })
        : XLSX.read(decodeText(bytes, encoding), { type: 'string', raw: false });
}

/**
 * Parse an Excel/CSV file into an array of ParsedColumn objects.
 * The first row is used as the column name; remaining rows are data.
 * Entirely empty columns (all blank) are dropped.
 *
 * `encoding` is a TextDecoder label (e.g. 'shift-jis') that overrides the
 * detection above for text files. Binary workbooks ignore it.
 */
export async function parseFile(file: File, encoding?: string): Promise<ParsedColumn[]> {
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

    let workbook: XLSX.WorkBook;
    try {
        workbook = readWorkbook(buffer, encoding);
    } catch {
        throw { code: 'FILE_READ_ERROR', message: 'Could not parse file.' } satisfies SheetMapperError;
    }

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
    const maxCols = rows.reduce((max, r) => Math.max(max, r.length), 0);
    const columns: ParsedColumn[] = [];

    for (let c = 0; c < maxCols; c++) {
        const allValues = rows.map((row) => String(row[c] ?? ''));
        const name = allValues[0] ?? '';
        const data = allValues.slice(1);

        // Drop columns where every data cell is empty
        if (data.every((v) => v === '')) continue;

        columns.push({ index: c, name, data });
    }

    if (columns.length === 0) {
        throw { code: 'EMPTY_WORKSHEET', message: 'The worksheet is empty.' } satisfies SheetMapperError;
    }

    return columns;
}
