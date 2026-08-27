import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { useSheetMapper } from '../composables/useSheetMapper';
import type { SchemaField, MatcherFn, ParsedColumn } from '../types';

vi.mock('../utils/parseFile', () => ({ parseFile: vi.fn() }));
import { parseFile } from '../utils/parseFile';
const mockParseFile = parseFile as unknown as ReturnType<typeof vi.fn>;

const fields: SchemaField[] = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
];

const columns: ParsedColumn[] = [
    { index: 0, name: 'A', data: ['a@a.com'] },
    { index: 1, name: 'B', data: ['b@b.com'] },
];

function fakeFile() {
    return new File(['x'], 'a.csv', { type: 'text/csv' });
}

async function load(mapper: ReturnType<typeof useSheetMapper>) {
    mockParseFile.mockResolvedValueOnce(columns.map((c) => ({ ...c, data: [...c.data] })));
    await mapper.loadFile(fakeFile());
}

describe('validate — duplicate assignments', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('rejects a custom matcher that maps one field to two columns', async () => {
        const duplicating: MatcherFn = (cols) => new Map(cols.map((_, i) => [i, 'email']));
        const mapper = useSheetMapper(fields, { matcher: duplicating });
        await load(mapper);

        expect(mapper.columns.value.map((c) => c.assignedKey)).toEqual(['email', 'email']);
        expect(mapper.validate()).toBeNull();
        expect(mapper.error.value).toMatchObject({
            code: 'DUPLICATE_ASSIGNMENTS',
            duplicateFields: ['email'],
        });
    });

    it('reports every duplicated field, not just the first', async () => {
        const threeCols: ParsedColumn[] = [
            { index: 0, name: 'A', data: ['1'] },
            { index: 1, name: 'B', data: ['2'] },
            { index: 2, name: 'C', data: ['3'] },
            { index: 3, name: 'D', data: ['4'] },
        ];
        const pairs: MatcherFn = () =>
            new Map([[0, 'email'], [1, 'email'], [2, 'name'], [3, 'name']]);
        const mapper = useSheetMapper(fields, { matcher: pairs });
        mockParseFile.mockResolvedValueOnce(threeCols);
        await mapper.loadFile(fakeFile());

        expect(mapper.validate()).toBeNull();
        expect(mapper.error.value?.duplicateFields).toEqual(['email', 'name']);
    });

    it('ignores duplicate "ignore" markers', async () => {
        const mapper = useSheetMapper(fields, { autoIgnore: true, matcher: () => new Map() });
        await load(mapper);

        expect(mapper.columns.value.map((c) => c.assignedKey)).toEqual(['ignore', 'ignore']);
        expect(mapper.validate()).not.toBeNull();
        expect(mapper.error.value).toBeNull();
    });

    it('still passes when every assignment is unique', async () => {
        const mapper = useSheetMapper(fields, {
            matcher: () => new Map([[0, 'email'], [1, 'name']]),
        });
        await load(mapper);

        const results = mapper.validate();
        expect(results?.map((r) => r.field)).toEqual(['email', 'name']);
        expect(mapper.error.value).toBeNull();
    });

    it('is unreachable through assignField, which reassigns instead', async () => {
        const mapper = useSheetMapper(fields, { matcher: () => new Map() });
        await load(mapper);

        mapper.assignField(0, 'email');
        mapper.assignField(1, 'email');

        expect(mapper.columns.value.map((c) => c.assignedKey)).toEqual([null, 'email']);
    });

    it('is unreachable through auto re-matching on a reactive schema', async () => {
        const reactive = ref<SchemaField[]>([]);
        const mapper = useSheetMapper(reactive);
        await load(mapper);

        mapper.assignField(1, 'email');
        reactive.value = [{ key: 'email', label: 'A' }];
        await nextTick();

        const assigned = mapper.columns.value.map((c) => c.assignedKey);
        expect(assigned.filter((k) => k === 'email')).toHaveLength(1);
    });
});
