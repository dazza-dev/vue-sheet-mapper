// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SheetMapper from '../components/SheetMapper.vue';
import type { SchemaField, ParsedColumn, MappingOutput } from '../types';

vi.mock('../utils/parseFile', () => ({ parseFile: vi.fn() }));
import { parseFile } from '../utils/parseFile';
const mockParseFile = vi.mocked(parseFile);

const fields: SchemaField[] = [
    { key: 'name', label: 'Name', requireColumn: true },
    { key: 'email', label: 'Email', requireColumn: true },
];

// index 1 is missing on purpose: an entirely empty column that parseFile dropped.
const parsedColumns: ParsedColumn[] = [
    { index: 0, name: 'Name', data: ['Ana', 'Luis'] },
    { index: 2, name: 'Email', data: ['ana@test.com', 'luis@test.com'] },
];

const csvFile = new File(['x'], 'test.csv', { type: 'text/csv' });

async function loadFile(wrapper: ReturnType<typeof mount>) {
    mockParseFile.mockResolvedValueOnce(parsedColumns.map((c) => ({ ...c, data: [...c.data] })));
    await wrapper.findComponent({ name: 'SheetDropzone' }).vm.$emit('file-selected', csvFile);
    await flushPromises();
}

beforeEach(() => mockParseFile.mockReset());

describe('SheetMapper — output prop', () => {
    it("emits { file, mapping, hasHeaders } when output is 'mapping'", async () => {
        const wrapper = mount(SheetMapper, { props: { fields, output: 'mapping' } });
        await loadFile(wrapper);

        await wrapper.find('.vsm-btn--primary').trigger('click');
        await flushPromises();

        const payload = wrapper.emitted('mapped')![0][0] as MappingOutput;
        expect(Array.isArray(payload)).toBe(false);
        expect(payload.file).toBe(csvFile);
        expect(payload.hasHeaders).toBe(true);
        expect(payload.mapping).toEqual({ 0: 'name', 2: 'email' });
    });

    it("ignores transform when output is 'mapping'", async () => {
        const transform = vi.fn((row: Record<string, string>) => row);
        const wrapper = mount(SheetMapper, { props: { fields, output: 'mapping', transform } });
        await loadFile(wrapper);

        await wrapper.find('.vsm-btn--primary').trigger('click');
        await flushPromises();

        expect(transform).not.toHaveBeenCalled();
    });

    it("still emits MappedResult[] with the default output ('rows')", async () => {
        const wrapper = mount(SheetMapper, { props: { fields } });
        await loadFile(wrapper);

        await wrapper.find('.vsm-btn--primary').trigger('click');
        await flushPromises();

        const mapped = wrapper.emitted('mapped')![0][0] as unknown[];
        expect(Array.isArray(mapped)).toBe(true);
        expect(mapped).toHaveLength(2);
        expect(mapped[0]).toMatchObject({ field: 'name', columnName: 'Name' });
    });

    it("emits an error instead of a payload when the mapping is incomplete, even with output 'mapping'", async () => {
        const wrapper = mount(SheetMapper, {
            props: { fields: [...fields, { key: 'phone', label: 'Phone', requireColumn: true }], output: 'mapping' },
        });
        await loadFile(wrapper);

        await wrapper.find('.vsm-btn--primary').trigger('click');
        await flushPromises();

        expect(wrapper.emitted('mapped')).toBeUndefined();
        expect(wrapper.emitted('error')![0][0]).toMatchObject({ code: 'MISSING_REQUIRED_FIELDS' });
    });
});
