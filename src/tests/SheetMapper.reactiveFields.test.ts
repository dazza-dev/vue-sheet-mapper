// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SheetMapper from '../components/SheetMapper.vue';
import type { SchemaField, ParsedColumn } from '../types';

vi.mock('../utils/parseFile', () => ({ parseFile: vi.fn() }));
import { parseFile } from '../utils/parseFile';
const mockParseFile = vi.mocked(parseFile);

const parsedColumns: ParsedColumn[] = [
    { index: 0, name: 'Name', data: ['Ana', 'Luis'] },
    { index: 1, name: 'Email', data: ['ana@mail.com', 'luis@mail.com'] },
];

const lateFields: SchemaField[] = [
    { key: 'name', label: 'Name', requireColumn: true },
    { key: 'email', label: 'Email', requireColumn: true },
];

function columnStates(wrapper: ReturnType<typeof mount>) {
    return (wrapper.vm as unknown as { columns: { name: string; assignedKey: string | null }[] }).columns;
}

async function loadFile(wrapper: ReturnType<typeof mount>) {
    mockParseFile.mockResolvedValueOnce(parsedColumns.map((c) => ({ ...c, data: [...c.data] })));
    await wrapper.findComponent({ name: 'SheetDropzone' }).vm.$emit('file-selected', new File(['x'], 'test.csv', { type: 'text/csv' }));
    await flushPromises();
}

beforeEach(() => mockParseFile.mockReset());

describe('SheetMapper — asynchronous schema', () => {
    it('keeps the loaded file when the fields arrive later', async () => {
        const wrapper = mount(SheetMapper, { props: { fields: [] as SchemaField[] } });
        await loadFile(wrapper);

        expect(columnStates(wrapper)).toHaveLength(2);
        expect(columnStates(wrapper).map((c) => c.assignedKey)).toEqual([null, null]);

        // Fields resolve from the backend after the user already picked a file.
        await wrapper.setProps({ fields: lateFields });
        await flushPromises();

        // The file survives…
        expect(wrapper.findComponent({ name: 'SheetDropzone' }).exists()).toBe(false);
        expect(columnStates(wrapper)).toHaveLength(2);
        // …and the columns are auto-matched against the schema that just arrived.
        expect(columnStates(wrapper).map((c) => c.assignedKey)).toEqual(['name', 'email']);
    });
});
