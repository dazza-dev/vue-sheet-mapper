// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick, defineComponent, h, unref } from 'vue';
import { mount } from '@vue/test-utils';
import SheetMapper from '../components/SheetMapper.vue';
import type { MatcherFn, SchemaField, ParsedColumn, ColumnState } from '../types';

vi.mock('../utils/parseFile', () => ({ parseFile: vi.fn() }));
import { parseFile } from '../utils/parseFile';
const mockParseFile = parseFile as unknown as ReturnType<typeof vi.fn>;

const fields: SchemaField[] = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
];

const columns: ParsedColumn[] = [
    { index: 0, name: 'Email', data: ['a@a.com', 'b@b.com', 'c@c.com', 'd@d.com', 'e@e.com'] },
    { index: 1, name: 'Name', data: ['Ana', 'Luis', 'Sofía', 'Elias', 'Nadia'] },
];

/** The setup bindings are not part of the public typing, but they are the state under test. */
function stateOf(wrapper: ReturnType<typeof mount>) {
    return (wrapper.findComponent(SheetMapper).vm.$ as unknown as { setupState: Record<string, unknown> }).setupState;
}

function csv() {
    return new File(['x'], 'a.csv', { type: 'text/csv' });
}

async function loadInto(state: Record<string, unknown>, cols = columns) {
    mockParseFile.mockResolvedValueOnce(cols.map((c) => ({ ...c, data: [...c.data] })));
    await (state.onFileSelected as (f: File) => Promise<void>)(csv());
    await nextTick();
}

function assignedKeys(state: Record<string, unknown>) {
    return (unref(state.columns) as ColumnState[]).map((c) => c.assignedKey);
}

describe('props that reach the composable stay live', () => {
    beforeEach(() => mockParseFile.mockReset());

    it('picks up a `matcher` swapped after mount', async () => {
        const swapped: MatcherFn = () => new Map([[0, 'name'], [1, 'email']]);
        const matcher = ref<MatcherFn | undefined>(undefined);
        const wrapper = mount(defineComponent({
            setup: () => () => h(SheetMapper, { fields, matcher: matcher.value }),
        }));
        const state = stateOf(wrapper);

        matcher.value = swapped;
        await nextTick();
        await loadInto(state);

        expect(assignedKeys(state)).toEqual(['name', 'email']);
    });

    it('picks up `previewRows` changed after mount', async () => {
        const rows = ref(2);
        const wrapper = mount(defineComponent({
            setup: () => () => h(SheetMapper, { fields, previewRows: rows.value }),
        }));
        const state = stateOf(wrapper);

        rows.value = 5;
        await nextTick();
        await loadInto(state);

        expect((unref(state.columns) as ColumnState[])[0].previewData).toHaveLength(5);
    });

    it('picks up `defaultHasHeaders` changed after mount', async () => {
        const headers = ref(true);
        const wrapper = mount(defineComponent({
            setup: () => () => h(SheetMapper, { fields, defaultHasHeaders: headers.value }),
        }));
        const state = stateOf(wrapper);

        headers.value = false;
        await nextTick();
        await loadInto(state);

        expect(unref(state.hasHeaders)).toBe(false);
    });

    it('picks up `autoIgnore` changed after mount', async () => {
        const auto = ref(false);
        const wrapper = mount(defineComponent({
            setup: () => () => h(SheetMapper, { fields, autoIgnore: auto.value, matcher: () => new Map() }),
        }));
        const state = stateOf(wrapper);

        auto.value = true;
        await nextTick();
        await loadInto(state);

        expect(assignedKeys(state)).toEqual(['ignore', 'ignore']);
    });
});
