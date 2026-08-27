// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick, defineComponent, h, unref } from 'vue';
import { mount } from '@vue/test-utils';
import SheetMapper from '../components/SheetMapper.vue';
import { useSheetMapper } from '../composables/useSheetMapper';
import type { SchemaField, ParsedColumn, RowIssue, RowValidator } from '../types';

vi.mock('../utils/parseFile', () => ({ parseFile: vi.fn() }));
import { parseFile } from '../utils/parseFile';
const mockParseFile = parseFile as unknown as ReturnType<typeof vi.fn>;

const fields: SchemaField[] = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
];

const columns: ParsedColumn[] = [
    { index: 0, name: 'Email', data: ['a@a.com', 'nope', 'c@c.com'] },
    { index: 1, name: 'Name', data: ['Ana', 'Luis', ''] },
];

function csv() {
    return new File(['x'], 'a.csv', { type: 'text/csv' });
}

async function load(mapper: ReturnType<typeof useSheetMapper>) {
    mockParseFile.mockResolvedValueOnce(columns.map((c) => ({ ...c, data: [...c.data] })));
    await mapper.loadFile(csv());
}

/** Flags the rows a real validator would: bad email, missing name. */
const validator: RowValidator = (rows) =>
    rows.flatMap((row, index) => {
        const found: RowIssue[] = [];
        if (!row.email?.includes('@')) found.push({ index, field: 'email', message: 'Not a valid email' });
        if (!row.name) found.push({ index, field: 'name', message: 'Name is required' });
        return found;
    });

describe('row validation', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('reports nothing when no validator is configured', async () => {
        const mapper = useSheetMapper(fields);
        await load(mapper);
        expect(await mapper.checkRows()).toEqual([]);
    });

    it('routes the validator output into issues', async () => {
        const mapper = useSheetMapper(fields, { validateRows: validator });
        await load(mapper);

        const found = await mapper.checkRows();
        expect(found).toEqual([
            { index: 1, field: 'email', message: 'Not a valid email' },
            { index: 2, field: 'name', message: 'Name is required' },
        ]);
        expect(mapper.issues.value).toEqual(found);
    });

    it('resolves an issue to the spreadsheet row the user sees', async () => {
        const mapper = useSheetMapper(fields, { validateRows: validator });
        await load(mapper);
        const [first] = await mapper.checkRows();

        // Row 1 is the header, so array position 1 is the third line of the file.
        expect(mapper.hasHeaders.value).toBe(true);
        expect(mapper.issueRow(first)).toBe(3);

        mapper.toggleHeaders();
        expect(mapper.issueRow(first)).toBe(2);
    });

    it('awaits an async validator and flags it while running', async () => {
        let release: (v: RowIssue[]) => void = () => {};
        const pending = new Promise<RowIssue[]>((r) => { release = r; });
        const mapper = useSheetMapper(fields, { validateRows: () => pending });
        await load(mapper);

        const run = mapper.checkRows();
        await nextTick();
        expect(mapper.checkingRows.value).toBe(true);

        release([{ index: 0, message: 'from the server' }]);
        await run;
        expect(mapper.checkingRows.value).toBe(false);
        expect(mapper.issues.value).toHaveLength(1);
    });

    it('clears the flag when the validator throws', async () => {
        const mapper = useSheetMapper(fields, {
            validateRows: () => { throw new Error('backend down'); },
        });
        await load(mapper);

        await expect(mapper.checkRows()).rejects.toThrow('backend down');
        expect(mapper.checkingRows.value).toBe(false);
    });

    it('does not run when the mapping itself is invalid', async () => {
        const spy = vi.fn(() => []);
        const mapper = useSheetMapper(fields, { validateRows: spy, matcher: () => new Map() });
        await load(mapper);

        expect(await mapper.checkRows()).toEqual([]);
        expect(spy).not.toHaveBeenCalled();
        expect(mapper.error.value?.code).toBe('UNASSIGNED_COLUMNS');
    });

    it('drops issues when a new file is loaded', async () => {
        const mapper = useSheetMapper(fields, { validateRows: validator });
        await load(mapper);
        await mapper.checkRows();
        expect(mapper.issues.value.length).toBeGreaterThan(0);

        await load(mapper);
        expect(mapper.issues.value).toEqual([]);
    });
});

describe('<SheetMapper> with a validator', () => {
    beforeEach(() => mockParseFile.mockReset());

    function mountWith(validateRows: RowValidator) {
        return mount(defineComponent({
            setup: () => () => h(SheetMapper, { fields, validateRows }),
        }));
    }

    it('emits invalid instead of mapped when rows have problems', async () => {
        const wrapper = mountWith(validator);
        const mapper = wrapper.findComponent(SheetMapper);
        const state = (mapper.vm.$ as unknown as { setupState: Record<string, unknown> }).setupState;

        mockParseFile.mockResolvedValueOnce(columns.map((c) => ({ ...c, data: [...c.data] })));
        await (state.onFileSelected as (f: File) => Promise<void>)(csv());
        await nextTick();

        await (state.handleValidate as () => Promise<void>)();
        await nextTick();

        expect(mapper.emitted('mapped')).toBeUndefined();
        expect(mapper.emitted('invalid')?.[0][0]).toHaveLength(2);
        expect(unref(state.issues)).toHaveLength(2);
    });

    it('emits mapped once the data is clean', async () => {
        const wrapper = mountWith(() => []);
        const mapper = wrapper.findComponent(SheetMapper);
        const state = (mapper.vm.$ as unknown as { setupState: Record<string, unknown> }).setupState;

        mockParseFile.mockResolvedValueOnce(columns.map((c) => ({ ...c, data: [...c.data] })));
        await (state.onFileSelected as (f: File) => Promise<void>)(csv());
        await nextTick();

        await (state.handleValidate as () => Promise<void>)();
        await nextTick();

        expect(mapper.emitted('invalid')).toBeUndefined();
        expect(mapper.emitted('mapped')).toHaveLength(1);
    });
});
