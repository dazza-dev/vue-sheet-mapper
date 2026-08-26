import { describe, it, expect } from 'vitest';
import { autoMatch } from '../utils/autoMatch';
import type { ParsedColumn, SchemaField } from '../types';

const fields: SchemaField[] = [
    { key: 'first_name', label: 'First Name', aliases: ['forename', 'given name'] },
    { key: 'last_name',  label: 'Last Name',  aliases: ['surname'] },
    { key: 'email',      label: 'Email',       aliases: ['mail'] },
];

function col(name: string, index = 0): ParsedColumn {
    return { index, name, data: ['value'] };
}

describe('autoMatch', () => {
    it('matches a column by exact label', () => {
        const result = autoMatch([col('Email')], fields);
        expect(result.get(0)).toBe('email');
    });

    it('is case-insensitive', () => {
        const result = autoMatch([col('FIRST NAME')], fields);
        expect(result.get(0)).toBe('first_name');
    });

    it('matches a column by alias', () => {
        const result = autoMatch([col('forename')], fields);
        expect(result.get(0)).toBe('first_name');
    });

    it('matches alias case-insensitively', () => {
        const result = autoMatch([col('SURNAME')], fields);
        expect(result.get(0)).toBe('last_name');
    });

    it('returns empty map when no columns match', () => {
        const result = autoMatch([col('Salary'), col('Department')], fields);
        expect(result.size).toBe(0);
    });

    it('prevents assigning the same field to two columns', () => {
        // 'Email' and 'mail' both resolve to the same field — first match wins
        const result = autoMatch([col('Email'), col('mail')], fields);
        expect(result.get(0)).toBe('email');
        expect(result.get(1)).toBeUndefined();
    });

    it('matches multiple columns to different fields', () => {
        const result = autoMatch([col('First Name'), col('Last Name'), col('Email')], fields);
        expect(result.get(0)).toBe('first_name');
        expect(result.get(1)).toBe('last_name');
        expect(result.get(2)).toBe('email');
    });

    it('skips columns with empty names', () => {
        const result = autoMatch([col(''), col('Email')], fields);
        expect(result.get(0)).toBeUndefined();
        expect(result.get(1)).toBe('email');
    });

    it('returns empty map for empty column list', () => {
        expect(autoMatch([], fields).size).toBe(0);
    });

    it('returns empty map when fields list is empty', () => {
        expect(autoMatch([col('Email')], []).size).toBe(0);
    });

    it('matches a column by field key directly', () => {
        const result = autoMatch([col('first_name')], fields);
        expect(result.get(0)).toBe('first_name');
    });

    it('matches accent-insensitively and removes special characters', () => {
        const customFields: SchemaField[] = [
            { key: 'cedula', label: 'Cédula de Ciudadanía', aliases: ['número de identificación'] },
            { key: 'descripcion', label: 'Descripción del Servicio' },
        ];
        const result = autoMatch(
            [col('CÉDULA'), col('numero de identificacion'), col('DESCRIPCION')],
            customFields
        );
        expect(result.get(0)).toBe('cedula');
        expect(result.get(2)).toBe('descripcion');
    });
});
