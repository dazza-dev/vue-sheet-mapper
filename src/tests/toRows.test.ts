import { describe, it, expect } from 'vitest';
import { toRows } from '../utils/toRows';
import type { MappedResult } from '../types';

function col(field: string, data: string[]): MappedResult {
    return { field, columnName: field, data };
}

describe('toRows', () => {
    it('returns empty array for empty input', () => {
        expect(toRows([])).toEqual([]);
    });

    it('converts a single column to row objects', () => {
        const result = toRows([col('email', ['a@a.com', 'b@b.com'])]);
        expect(result).toEqual([
            { email: 'a@a.com' },
            { email: 'b@b.com' },
        ]);
    });

    it('converts multiple columns to row objects', () => {
        const result = toRows([
            col('first_name', ['Ana', 'Luis']),
            col('email',      ['ana@mail.com', 'luis@mail.com']),
        ]);
        expect(result).toEqual([
            { first_name: 'Ana',  email: 'ana@mail.com' },
            { first_name: 'Luis', email: 'luis@mail.com' },
        ]);
    });

    it('fills missing values with empty string when columns have different lengths', () => {
        const result = toRows([
            col('name',  ['Ana', 'Luis', 'María']),
            col('phone', ['111']),
        ]);
        expect(result).toEqual([
            { name: 'Ana',   phone: '111' },
            { name: 'Luis',  phone: '' },
            { name: 'María', phone: '' },
        ]);
    });

    it('uses the longest column to determine row count', () => {
        const result = toRows([
            col('a', ['1']),
            col('b', ['x', 'y', 'z']),
        ]);
        expect(result).toHaveLength(3);
    });

    it('uses field key (not columnName) as the object key', () => {
        const result = toRows([{ field: 'email', columnName: 'Correo', data: ['a@a.com'] }]);
        expect(result[0]).toHaveProperty('email', 'a@a.com');
        expect(result[0]).not.toHaveProperty('Correo');
    });
});
