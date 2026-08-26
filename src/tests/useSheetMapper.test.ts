import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { useSheetMapper } from '../composables/useSheetMapper';
import type { SchemaField, ParsedColumn } from '../types';

// Mock parseFile so tests don't need a real File + FileReader + XLSX
vi.mock('../utils/parseFile', () => ({
    parseFile: vi.fn(),
}));

import { parseFile } from '../utils/parseFile';
const mockParseFile = vi.mocked(parseFile);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fields: SchemaField[] = [
    { key: 'name',  label: 'Name',  required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Phone' },
];

const parsedColumns: ParsedColumn[] = [
    { index: 0, name: 'Name',  data: ['Ana', 'Luis'] },
    { index: 1, name: 'Email', data: ['ana@mail.com', 'luis@mail.com'] },
    { index: 2, name: 'Phone', data: ['111', '222'] },
];

function fakeFile(name = 'test.csv', size = 100): File {
    const f = new File(['x'.repeat(size)], name, { type: 'text/csv' });
    return f;
}

async function loadWithColumns(
    mapper: ReturnType<typeof useSheetMapper>,
    cols = parsedColumns,
    file = fakeFile(),
) {
    const clonedCols = cols.map((c) => ({ index: c.index, name: c.name, data: [...c.data] }));
    mockParseFile.mockResolvedValueOnce(clonedCols);
    await mapper.loadFile(file);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useSheetMapper — initial state', () => {
    it('starts with no columns, no error, not loading', () => {
        const { columns, error, loading, hasFile } = useSheetMapper(fields);
        expect(columns.value).toEqual([]);
        expect(error.value).toBeNull();
        expect(loading.value).toBe(false);
        expect(hasFile.value).toBe(false);
    });

    it('hasHeaders defaults to true', () => {
        const { hasHeaders } = useSheetMapper(fields);
        expect(hasHeaders.value).toBe(true);
    });

    it('defaultHasHeaders option sets initial hasHeaders', () => {
        const { hasHeaders } = useSheetMapper(fields, { defaultHasHeaders: false });
        expect(hasHeaders.value).toBe(false);
    });
});

describe('useSheetMapper — loadFile', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('sets columns after successful parse', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        expect(mapper.columns.value).toHaveLength(3);
        expect(mapper.hasFile.value).toBe(true);
    });

    it('auto-matches columns to fields by label', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        expect(mapper.columns.value[0].assignedKey).toBe('name');
        expect(mapper.columns.value[1].assignedKey).toBe('email');
        expect(mapper.columns.value[2].assignedKey).toBe('phone');
    });

    it('sets error and clears file on parseFile failure', async () => {
        const mapper = useSheetMapper(fields);
        mockParseFile.mockRejectedValueOnce({ code: 'INVALID_FILE_TYPE', message: 'Bad file' });
        await mapper.loadFile(fakeFile());
        expect(mapper.error.value?.code).toBe('INVALID_FILE_TYPE');
        expect(mapper.hasFile.value).toBe(false);
    });

    it('sets FILE_READ_ERROR when the file cannot be read', async () => {
        const mapper = useSheetMapper(fields);
        mockParseFile.mockRejectedValueOnce({ code: 'FILE_READ_ERROR', message: 'Could not read file.' });
        await mapper.loadFile(fakeFile());
        expect(mapper.error.value?.code).toBe('FILE_READ_ERROR');
        expect(mapper.hasFile.value).toBe(false);
    });

    it('rejects files larger than maxFileSize', async () => {
        const mapper = useSheetMapper(fields, { maxFileSize: 50 });
        await mapper.loadFile(fakeFile('big.csv', 100));
        expect(mapper.error.value?.code).toBe('FILE_TOO_LARGE');
        expect(mapper.error.value?.maxSize).toBe('50 B');
        expect(mockParseFile).not.toHaveBeenCalled();
    });

    it('accepts files within maxFileSize', async () => {
        const mapper = useSheetMapper(fields, { maxFileSize: 200 });
        await loadWithColumns(mapper, parsedColumns, fakeFile('small.csv', 100));
        expect(mapper.error.value).toBeNull();
        expect(mapper.hasFile.value).toBe(true);
    });

    it('rejects files with more rows than maxRows', async () => {
        const cols: ParsedColumn[] = [{ index: 0, name: 'Name', data: Array(1001).fill('value') }];
        const mapper = useSheetMapper(fields, { maxRows: 1000 });
        mockParseFile.mockResolvedValueOnce(cols);
        await mapper.loadFile(fakeFile());
        expect(mapper.error.value?.code).toBe('TOO_MANY_ROWS');
        expect(mapper.error.value?.rowCount).toBe(1001);
        expect(mapper.hasFile.value).toBe(false);
    });

    it('accepts files within maxRows', async () => {
        const cols: ParsedColumn[] = [{ index: 0, name: 'Name', data: Array(500).fill('value') }];
        const mapper = useSheetMapper(fields, { maxRows: 1000 });
        mockParseFile.mockResolvedValueOnce(cols);
        await mapper.loadFile(fakeFile());
        expect(mapper.error.value).toBeNull();
        expect(mapper.hasFile.value).toBe(true);
    });

    it('uses custom matcher when provided', async () => {
        const customMatcher = vi.fn().mockReturnValue(new Map([[0, 'phone']]));
        const mapper = useSheetMapper(fields, { matcher: customMatcher });
        await loadWithColumns(mapper);
        expect(customMatcher).toHaveBeenCalled();
        expect(mapper.columns.value[0].assignedKey).toBe('phone');
    });

    it('sets unmatched columns to ignore when autoIgnore is true', async () => {
        const cols: ParsedColumn[] = [
            { index: 0, name: 'Name',    data: ['Ana'] },
            { index: 1, name: 'Unknown', data: ['x'] },
        ];
        const mapper = useSheetMapper(fields, { autoIgnore: true });
        await loadWithColumns(mapper, cols);
        expect(mapper.columns.value[0].assignedKey).toBe('name');
        expect(mapper.columns.value[1].assignedKey).toBe('ignore');
    });

    it('resets hasHeaders to defaultHasHeaders on each load', async () => {
        const mapper = useSheetMapper(fields, { defaultHasHeaders: false });
        await loadWithColumns(mapper);
        expect(mapper.hasHeaders.value).toBe(false);
    });
});

describe('useSheetMapper — assignField', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('assigns a field to a column', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.assignField(2, 'phone');
        expect(mapper.columns.value[2].assignedKey).toBe('phone');
    });

    it('removes the field from another column when reassigning', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        // column 0 has 'name', now assign 'name' to column 2
        mapper.assignField(2, 'name');
        expect(mapper.columns.value[2].assignedKey).toBe('name');
        expect(mapper.columns.value[0].assignedKey).toBeNull();
    });

    it('does nothing for an invalid column index', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        expect(() => mapper.assignField(99, 'name')).not.toThrow();
    });
});

describe('useSheetMapper — ignoreColumn / clearColumn', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('ignoreColumn sets assignedKey to "ignore"', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.ignoreColumn(2);
        expect(mapper.columns.value[2].assignedKey).toBe('ignore');
    });

    it('clearColumn sets assignedKey to null', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.clearColumn(0);
        expect(mapper.columns.value[0].assignedKey).toBeNull();
    });
});

describe('useSheetMapper — validate', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('fails with UNASSIGNED_COLUMNS when a column has no assignment', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.clearColumn(0); // leave name unassigned
        const result = mapper.validate();
        expect(result).toBeNull();
        expect(mapper.error.value?.code).toBe('UNASSIGNED_COLUMNS');
        expect(mapper.error.value?.unassignedColumns).toContain('Name');
    });

    it('fails with MISSING_REQUIRED_FIELDS when a required field is not mapped', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.ignoreColumn(0); // ignore the 'name' column — but name is required
        const result = mapper.validate();
        expect(result).toBeNull();
        expect(mapper.error.value?.code).toBe('MISSING_REQUIRED_FIELDS');
        expect(mapper.error.value?.missingFields).toContain('name');
    });

    it('succeeds and returns MappedResult[] when all columns are valid', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        const result = mapper.validate();
        expect(result).not.toBeNull();
        expect(result).toHaveLength(3);
        expect(result![0]).toMatchObject({ field: 'name', columnName: 'Name' });
    });

    it('clears error on success', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.clearColumn(0);
        mapper.validate(); // sets UNASSIGNED_COLUMNS
        mapper.assignField(0, 'name');
        mapper.validate(); // should clear error
        expect(mapper.error.value).toBeNull();
    });

    it('excludes ignored columns from the result', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.ignoreColumn(2); // ignore phone (not required)
        const result = mapper.validate();
        expect(result?.find(r => r.field === 'phone')).toBeUndefined();
    });

    it('includes data rows in the result', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        const result = mapper.validate();
        expect(result![0].data).toEqual(['Ana', 'Luis']);
    });
});

describe('useSheetMapper — toggleHeaders', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('moves header row into data when toggling off', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        const originalName = mapper.columns.value[0].name; // 'Name'
        mapper.toggleHeaders();
        expect(mapper.hasHeaders.value).toBe(false);
        expect(mapper.columns.value[0].data[0]).toBe(originalName); // 'Name' is now first data row
        expect(mapper.columns.value[0].name).toBe('Column 1');
    });

    it('promotes first data row to header when toggling on', async () => {
        const cols: ParsedColumn[] = [
            { index: 0, name: '', data: ['Name', 'Ana', 'Luis'] },
            { index: 1, name: '', data: ['Email', 'ana@mail.com', 'luis@mail.com'] },
        ];
        const mapper = useSheetMapper(fields, { defaultHasHeaders: false });
        mockParseFile.mockResolvedValueOnce(cols);
        await mapper.loadFile(fakeFile());
        expect(mapper.hasHeaders.value).toBe(false);
        mapper.toggleHeaders();
        expect(mapper.hasHeaders.value).toBe(true);
        expect(mapper.columns.value[0].name).toBe('Name');
        expect(mapper.columns.value[0].data).toEqual(['Ana', 'Luis']);
        expect(mapper.columns.value[1].name).toBe('Email');
    });

    it('uses columnLabel option for headerless column names', async () => {
        const mapper = useSheetMapper(fields, { columnLabel: (i) => `Col ${i + 1}` });
        await loadWithColumns(mapper);
        mapper.toggleHeaders();
        expect(mapper.columns.value[0].name).toBe('Col 1');
    });
});

describe('useSheetMapper — reset', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('clears all state', async () => {
        const mapper = useSheetMapper(fields);
        await loadWithColumns(mapper);
        mapper.reset();
        expect(mapper.columns.value).toEqual([]);
        expect(mapper.file.value).toBeNull();
        expect(mapper.error.value).toBeNull();
        expect(mapper.hasFile.value).toBe(false);
    });

    it('resets hasHeaders to defaultHasHeaders', async () => {
        const mapper = useSheetMapper(fields, { defaultHasHeaders: false });
        await loadWithColumns(mapper);
        mapper.toggleHeaders(); // sets to true
        mapper.reset();
        expect(mapper.hasHeaders.value).toBe(false);
    });
});

describe('useSheetMapper — reactive schemas & computed helpers', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('works with a ref of SchemaField[]', async () => {
        const reactiveFields = ref([
            { key: 'name', label: 'Name', required: true },
            { key: 'email', label: 'Email', required: true },
        ]);
        const mapper = useSheetMapper(reactiveFields);
        await loadWithColumns(mapper);

        expect(mapper.columns.value[0].assignedKey).toBe('name');
        expect(mapper.columns.value[1].assignedKey).toBe('email');
        expect(mapper.columns.value[2].assignedKey).toBeNull();

        expect(mapper.takenKeys.value.has('name')).toBe(true);
        expect(mapper.takenKeys.value.has('email')).toBe(true);
        expect(mapper.unassignedColumns.value).toHaveLength(1);
        expect(mapper.missingRequiredFields.value).toHaveLength(0);
        expect(mapper.isValid.value).toBe(false); // because Phone is unassigned

        expect(mapper.mapping.value).toEqual({
            0: 'name',
            1: 'email',
        });
    });

    it('auto-matches unassigned columns when reactive fields change asynchronously', async () => {
        const reactiveFields = ref<SchemaField[]>([]);
        const mapper = useSheetMapper(reactiveFields);
        await loadWithColumns(mapper);

        // Initially no fields, so all columns are unassigned
        expect(mapper.columns.value[0].assignedKey).toBeNull();
        expect(mapper.columns.value[1].assignedKey).toBeNull();
        expect(mapper.columns.value[2].assignedKey).toBeNull();

        // Asynchronous resolution of fields
        reactiveFields.value = [
            { key: 'name', label: 'Name', required: true },
            { key: 'email', label: 'Email', required: true },
            { key: 'phone', label: 'Phone' },
        ];
        await nextTick();

        // Columns automatically match against newly loaded fields
        expect(mapper.columns.value[0].assignedKey).toBe('name');
        expect(mapper.columns.value[1].assignedKey).toBe('email');
        expect(mapper.columns.value[2].assignedKey).toBe('phone');

        expect(mapper.unassignedColumns.value).toHaveLength(0);
        expect(mapper.missingRequiredFields.value).toHaveLength(0);
        expect(mapper.isValid.value).toBe(true);
        expect(mapper.mapping.value).toEqual({
            0: 'name',
            1: 'email',
            2: 'phone',
        });
    });

    it('sets all unassigned columns to ignore with ignoreUnassignedColumns', async () => {
        const partialFields: SchemaField[] = [{ key: 'name', label: 'Name', required: true }];
        const mapper = useSheetMapper(partialFields);
        await loadWithColumns(mapper);

        expect(mapper.unassignedColumns.value).toHaveLength(2); // Email and Phone
        expect(mapper.isValid.value).toBe(false);

        mapper.ignoreUnassignedColumns();

        expect(mapper.unassignedColumns.value).toHaveLength(0);
        expect(mapper.columns.value[1].assignedKey).toBe('ignore');
        expect(mapper.columns.value[2].assignedKey).toBe('ignore');
        expect(mapper.isValid.value).toBe(true);
        expect(mapper.mapping.value).toEqual({
            0: 'name',
        });
    });

    it('never re-assigns a key the user already placed on another column', async () => {
        const cols: ParsedColumn[] = [
            { index: 0, name: 'Name',     data: ['Ana'] },
            { index: 1, name: 'Contacto', data: ['a@a.com'] },
            { index: 2, name: 'Email',    data: ['b@b.com'] },
        ];
        const reactiveFields = ref<SchemaField[]>([{ key: 'name', label: 'Name' }]);
        const mapper = useSheetMapper(reactiveFields);
        await loadWithColumns(mapper, cols);

        // The user maps "Contacto" by hand before the email field exists
        mapper.assignField(1, 'email');

        reactiveFields.value = [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
        ];
        await nextTick();

        const assigned = mapper.columns.value.map((c) => c.assignedKey);
        expect(assigned.filter((k) => k === 'email')).toHaveLength(1);
        expect(assigned).toEqual(['name', 'email', null]);
    });

    it('does not revert a cleared column when the fields array changes identity', async () => {
        const version = ref(0);
        const mapper = useSheetMapper(() => {
            void version.value; // a fresh array on every re-evaluation, same keys
            return [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
            ];
        });
        await loadWithColumns(mapper);
        expect(mapper.columns.value[0].assignedKey).toBe('name');

        mapper.clearColumn(0);
        expect(mapper.columns.value[0].assignedKey).toBeNull();

        version.value++; // parent re-render hands over a new array
        await nextTick();

        expect(mapper.columns.value[0].assignedKey).toBeNull();
    });

    it('clears a column whose field was removed from the schema', async () => {
        const reactiveFields = ref<SchemaField[]>([
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
        ]);
        const mapper = useSheetMapper(reactiveFields);
        await loadWithColumns(mapper);
        expect(mapper.columns.value[2].assignedKey).toBe('phone');

        reactiveFields.value = [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
        ];
        await nextTick();

        expect(mapper.columns.value[2].assignedKey).toBeNull();
        expect(mapper.mapping.value).toEqual({ 0: 'name', 1: 'email' });
    });

    it('loading a second file resets the touched columns', async () => {
        const reactiveFields = ref<SchemaField[]>([
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
        ]);
        const mapper = useSheetMapper(reactiveFields);

        await loadWithColumns(mapper, parsedColumns, fakeFile('a.csv'));
        mapper.clearColumn(0); // column 0 is now touched for file A

        await loadWithColumns(mapper, parsedColumns, fakeFile('b.csv'));
        expect(mapper.columns.value[0].assignedKey).toBe('name');

        // With `touched` reset, column 0 is auto-matched again — and therefore
        // cleared when its field leaves the schema.
        reactiveFields.value = [
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
        ];
        await nextTick();

        expect(mapper.columns.value[0].assignedKey).toBeNull();
    });

    it('computes missingRequiredFields correctly', async () => {
        const strictFields: SchemaField[] = [
            { key: 'name', label: 'Name', required: true },
            { key: 'code', label: 'Employee Code', required: true },
        ];
        const mapper = useSheetMapper(strictFields);
        await loadWithColumns(mapper);

        expect(mapper.missingRequiredFields.value).toHaveLength(1);
        expect(mapper.missingRequiredFields.value[0].key).toBe('code');
        expect(mapper.isValid.value).toBe(false);
    });
});
