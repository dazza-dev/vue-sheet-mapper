// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SheetMapper from '../components/SheetMapper.vue';
import type { SchemaField, ParsedColumn } from '../types';

vi.mock('../utils/parseFile', () => ({ parseFile: vi.fn() }));
import { parseFile } from '../utils/parseFile';
const mockParseFile = vi.mocked(parseFile);

const fields: SchemaField[] = [
    { key: 'name',  label: 'Name',  requireColumn: true },
    { key: 'email', label: 'Email', requireColumn: true },
];

const parsedColumns: ParsedColumn[] = [
    { index: 0, name: 'Name',  data: ['Ana', 'Luis', 'Maria'] },
    { index: 1, name: 'Email', data: ['ana@test.com', 'luis@test.com', 'maria@test.com'] },
];

async function loadFile(wrapper: ReturnType<typeof mount>) {
    mockParseFile.mockResolvedValueOnce(parsedColumns);
    const dropzone = wrapper.findComponent({ name: 'SheetDropzone' });
    await dropzone.vm.$emit('file-selected', new File(['x'], 'test.csv'));
    await flushPromises();
}

beforeEach(() => mockParseFile.mockReset());

describe('SheetMapper — transform prop', () => {
    it('emits row-oriented data when transform is provided', async () => {
        const transform = (row: Record<string, string>) => ({
            fullName: row.name,
            mail: row.email,
        });
        const wrapper = mount(SheetMapper, { props: { fields, transform } });
        await loadFile(wrapper);

        await wrapper.find('.vsm-btn--primary').trigger('click');
        await flushPromises();

        const mapped = wrapper.emitted('mapped');
        expect(mapped).toBeTruthy();
        expect(mapped![0][0]).toEqual([
            { fullName: 'Ana',   mail: 'ana@test.com' },
            { fullName: 'Luis',  mail: 'luis@test.com' },
            { fullName: 'Maria', mail: 'maria@test.com' },
        ]);
    });

    it('filters out rows where transform returns null', async () => {
        const transform = (row: Record<string, string>) =>
            row.name !== 'Luis' ? row : null;

        const wrapper = mount(SheetMapper, { props: { fields, transform } });
        await loadFile(wrapper);

        await wrapper.find('.vsm-btn--primary').trigger('click');
        await flushPromises();

        const mapped = wrapper.emitted('mapped')![0][0] as unknown[];
        expect(mapped).toHaveLength(2);
        expect((mapped[0] as Record<string, string>).name).toBe('Ana');
        expect((mapped[1] as Record<string, string>).name).toBe('Maria');
    });

    it('emits MappedResult[] when no transform is provided', async () => {
        const wrapper = mount(SheetMapper, { props: { fields } });
        await loadFile(wrapper);

        await wrapper.find('.vsm-btn--primary').trigger('click');
        await flushPromises();

        const mapped = wrapper.emitted('mapped')![0][0] as unknown[];
        expect(mapped).toHaveLength(2);
        expect(mapped[0]).toMatchObject({ field: 'name', columnName: 'Name' });
    });
});
