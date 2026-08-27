// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ColumnCard from '../components/ColumnCard.vue';
import { getMessages } from '../i18n';
import type { ColumnState, SchemaField } from '../types';

const messages = getMessages('en');

const fields: SchemaField[] = [
    { key: 'name',  label: 'Full Name', requireColumn: true },
    { key: 'email', label: 'Email',     requireColumn: true },
    { key: 'phone', label: 'Phone' },
];

function col(overrides: Partial<ColumnState> = {}): ColumnState {
    return {
        index: 0,
        name: 'Name',
        assignedKey: null,
        data: ['Ana', 'Luis'],
        previewData: ['Ana', 'Luis'],
        ...overrides,
    };
}

function mountCard(columnOverrides: Partial<ColumnState> = {}, takenKeys: string[] = []) {
    return mount(ColumnCard, {
        props: {
            column: col(columnOverrides),
            index: 0,
            fields,
            takenKeys: new Set(takenKeys),
            messages,
        },
    });
}

describe('ColumnCard — states', () => {
    it('shows unassigned status when assignedKey is null', () => {
        const wrapper = mountCard({ assignedKey: null });
        expect(wrapper.text()).toContain(messages.columns.unassigned);
        expect(wrapper.find('.vsm-card--unassigned').exists()).toBe(true);
    });

    it('shows assigned status with field label', () => {
        const wrapper = mountCard({ assignedKey: 'name' });
        expect(wrapper.text()).toContain('Full Name');
        expect(wrapper.find('.vsm-card--assigned').exists()).toBe(true);
    });

    it('shows ignored status', () => {
        const wrapper = mountCard({ assignedKey: 'ignore' });
        expect(wrapper.text()).toContain(messages.columns.ignored);
        expect(wrapper.find('.vsm-card--ignored').exists()).toBe(true);
    });

    it('renders the column name', () => {
        const wrapper = mountCard({ name: 'Customer Email' });
        expect(wrapper.text()).toContain('Customer Email');
    });

    it('renders preview data rows', () => {
        const wrapper = mountCard({ previewData: ['Ana', 'Luis'] });
        expect(wrapper.text()).toContain('Ana');
        expect(wrapper.text()).toContain('Luis');
    });
});

describe('ColumnCard — select field', () => {
    it('shows the select only when unassigned', () => {
        const unassigned = mountCard({ assignedKey: null });
        expect(unassigned.find('select').exists()).toBe(true);

        const assigned = mountCard({ assignedKey: 'name' });
        expect(assigned.find('select').exists()).toBe(false);
    });

    it('label is associated with select via for/id', () => {
        const wrapper = mountCard({ assignedKey: null });
        const labelFor = wrapper.find('label').attributes('for');
        const selectId = wrapper.find('select').attributes('id');
        expect(labelFor).toBe('vsm-select-0');
        expect(selectId).toBe('vsm-select-0');
    });

    it('excludes fields already taken by other columns', () => {
        const wrapper = mountCard({ assignedKey: null }, ['email']);
        const options = wrapper.findAll('select option').map((o) => o.attributes('value'));
        expect(options).not.toContain('email');
        expect(options).toContain('name');
    });

    it('emits assign when a field is selected', async () => {
        const wrapper = mountCard({ assignedKey: null });
        const select = wrapper.find('select');
        await select.setValue('name');
        expect(wrapper.emitted('assign')).toBeTruthy();
        expect(wrapper.emitted('assign')![0]).toEqual(['name']);
    });

    it('emits ignore when ignore option is selected', async () => {
        const wrapper = mountCard({ assignedKey: null });
        await wrapper.find('select').setValue('ignore');
        expect(wrapper.emitted('ignore')).toBeTruthy();
    });
});

describe('ColumnCard — actions', () => {
    it('emits clear when change link is clicked on an assigned column', async () => {
        const wrapper = mountCard({ assignedKey: 'name' });
        await wrapper.find('.vsm-card__change-link').trigger('click');
        expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('emits clear when change link is clicked on an ignored column', async () => {
        const wrapper = mountCard({ assignedKey: 'ignore' });
        await wrapper.find('.vsm-card__change-link').trigger('click');
        expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('emits ignore when ignore link is clicked', async () => {
        const wrapper = mountCard({ assignedKey: null });
        await wrapper.find('.vsm-card__ignore-link').trigger('click');
        expect(wrapper.emitted('ignore')).toBeTruthy();
    });
});
