// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as XLSX from 'xlsx';
import { parseFile } from '../utils/parseFile';

function makeFile(data: (string | number)[][], name = 'test.xlsx'): File {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
    return new File([buf], name, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
}

function makeCsvFile(content: string, name = 'test.csv'): File {
    return new File([content], name, { type: 'text/csv' });
}

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('parseFile', () => {
    it('parses a valid xlsx file into columns', async () => {
        const file = makeFile([
            ['Name', 'Email'],
            ['Ana', 'ana@test.com'],
            ['Luis', 'luis@test.com'],
        ]);
        const cols = await parseFile(file);
        expect(cols).toHaveLength(2);
        expect(cols[0].name).toBe('Name');
        expect(cols[0].data).toEqual(['Ana', 'Luis']);
        expect(cols[1].name).toBe('Email');
        expect(cols[1].data).toEqual(['ana@test.com', 'luis@test.com']);
    });

    it('parses a valid csv file', async () => {
        const file = makeCsvFile('Name,Email\nAna,ana@test.com\nLuis,luis@test.com');
        const cols = await parseFile(file);
        expect(cols).toHaveLength(2);
        expect(cols[0].name).toBe('Name');
    });

    it('drops entirely empty columns', async () => {
        const file = makeFile([
            ['Name', '', 'Email'],
            ['Ana', '',  'ana@test.com'],
            ['Luis', '', 'luis@test.com'],
        ]);
        const cols = await parseFile(file);
        expect(cols).toHaveLength(2);
        expect(cols.map((c) => c.name)).toEqual(['Name', 'Email']);
    });

    it('throws INVALID_FILE_TYPE for unsupported extensions', async () => {
        const file = new File(['data'], 'report.pdf', { type: 'application/pdf' });
        await expect(parseFile(file)).rejects.toMatchObject({ code: 'INVALID_FILE_TYPE' });
    });

    it('throws EMPTY_WORKSHEET when sheet has no data rows', async () => {
        const file = makeFile([['Name', 'Email']]);
        await expect(parseFile(file)).rejects.toMatchObject({ code: 'EMPTY_WORKSHEET' });
    });

    it('throws EMPTY_WORKSHEET when all columns are empty after header', async () => {
        const file = makeFile([
            ['Name', 'Email'],
            ['', ''],
        ]);
        await expect(parseFile(file)).rejects.toMatchObject({ code: 'EMPTY_WORKSHEET' });
    });

    it('throws FILE_READ_ERROR when FileReader fails', async () => {
        vi.stubGlobal('FileReader', class {
            onload: ((e: ProgressEvent) => void) | null = null;
            onerror: ((e: ProgressEvent) => void) | null = null;
            readAsArrayBuffer() {
                setTimeout(() => this.onerror?.(new ProgressEvent('error')), 0);
            }
        });
        const file = makeCsvFile('Name\nAna');
        await expect(parseFile(file)).rejects.toMatchObject({ code: 'FILE_READ_ERROR' });
    });
});
