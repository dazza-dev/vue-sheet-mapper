// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { parseFile } from '../utils/parseFile';

const CSV = 'Nombre,Ciudad\nGarcía,Medellín\nPérez,Bogotá\nJoão,Düsseldorf\n';

function fileFromBytes(bytes: Uint8Array<ArrayBuffer>, name = 'test.csv'): File {
    return new File([bytes], name, { type: 'text/csv' });
}

function utf8(text: string): Uint8Array<ArrayBuffer> {
    return new TextEncoder().encode(text);
}

function withBom(bytes: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
    return new Uint8Array([0xef, 0xbb, 0xbf, ...bytes]);
}

/** Windows-1252 and Latin-1 agree over the accented characters used here. */
function cp1252(text: string): Uint8Array<ArrayBuffer> {
    return new Uint8Array([...text].map((c) => c.codePointAt(0)!));
}

function utf16(text: string, littleEndian: boolean): Uint8Array<ArrayBuffer> {
    const out = new Uint8Array(2 + text.length * 2);
    out[0] = littleEndian ? 0xff : 0xfe;
    out[1] = littleEndian ? 0xfe : 0xff;
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        out[2 + i * 2] = littleEndian ? code & 0xff : code >> 8;
        out[3 + i * 2] = littleEndian ? code >> 8 : code & 0xff;
    }
    return out;
}

async function names(file: File): Promise<string[]> {
    const columns = await parseFile(file);
    return columns[0].data;
}

describe('parseFile — text encoding', () => {
    it('decodes UTF-8 without a BOM', async () => {
        expect(await names(fileFromBytes(utf8(CSV)))).toEqual(['García', 'Pérez', 'João']);
    });

    it('decodes UTF-8 with a BOM', async () => {
        expect(await names(fileFromBytes(withBom(utf8(CSV))))).toEqual(['García', 'Pérez', 'João']);
    });

    it('falls back to Windows-1252 when the bytes are not valid UTF-8', async () => {
        expect(await names(fileFromBytes(cp1252(CSV)))).toEqual(['García', 'Pérez', 'João']);
    });

    it('decodes UTF-16 LE and BE', async () => {
        expect(await names(fileFromBytes(utf16(CSV, true)))).toEqual(['García', 'Pérez', 'João']);
        expect(await names(fileFromBytes(utf16(CSV, false)))).toEqual(['García', 'Pérez', 'João']);
    });

    it('honours an explicit encoding over detection', async () => {
        const file = fileFromBytes(cp1252(CSV));
        const columns = await parseFile(file, 'windows-1252');
        expect(columns[0].data).toEqual(['García', 'Pérez', 'João']);
    });

    it('ignores the encoding option for binary workbooks', async () => {
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Nombre'], ['García'], ['João']]), 'Sheet1');
        const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
        const file = new File([buf], 'test.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const columns = await parseFile(file, 'shift-jis');
        expect(columns[0].data).toEqual(['García', 'João']);
    });

    it('keeps ASCII untouched', async () => {
        const file = fileFromBytes(utf8('Name,City\nSmith,Leeds\n'));
        const columns = await parseFile(file);
        expect(columns.map((c) => c.name)).toEqual(['Name', 'City']);
        expect(columns[0].data).toEqual(['Smith']);
    });

    it('rejects an unparseable file with a typed error', async () => {
        const file = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x01])], 'broken.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        await expect(parseFile(file)).rejects.toMatchObject({ code: 'FILE_READ_ERROR' });
    });
});
