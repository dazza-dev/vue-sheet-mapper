<template>
    <div class="vsm-card" :class="cardClass">
        <!-- Header -->
        <div class="vsm-card__header">
            <slot name="header" :column="column" :field="assignedField" :clear="() => emit('clear')">
                <template v-if="column.assignedKey === null">
                    <span class="vsm-card__status vsm-card__status--unassigned">
                        <component :is="resolvedIcons.unassigned" width="16" height="16" class="vsm-card__status-icon" />
                        {{ messages.columns.unassigned }}
                    </span>
                </template>

                <template v-else-if="column.assignedKey === 'ignore'">
                    <span class="vsm-card__status vsm-card__status--ignored">
                        <component :is="resolvedIcons.ignored" width="16" height="16" class="vsm-card__status-icon" />
                        {{ messages.columns.ignored }}
                    </span>
                    <button class="vsm-card__change-link" type="button" @click="emit('clear')">
                        {{ messages.columns.changeColumn }}
                    </button>
                </template>

                <template v-else>
                    <span class="vsm-card__status vsm-card__status--assigned">
                        <component :is="resolvedIcons.assigned" width="16" height="16" class="vsm-card__status-icon" />
                        {{ assignedField?.label ?? column.assignedKey }}
                    </span>
                    <button class="vsm-card__change-link" type="button" @click="emit('clear')">
                        {{ messages.columns.changeColumn }}
                    </button>
                </template>
            </slot>
        </div>

        <!-- Column name (original file header) -->
        <div class="vsm-card__column-name">{{ column.name || '—' }}</div>

        <!-- Field selector — shown only when unassigned -->
        <div v-if="column.assignedKey === null" class="vsm-card__select-area">
            <slot
                name="select"
                :column="column"
                :fields="fields"
                :on-assign="(key: string) => emit('assign', key)"
                :on-ignore="() => emit('ignore')"
            >
                <label :for="`vsm-select-${index}`" class="vsm-card__select-label">
                    {{ messages.columns.columnLabel }} <em>"{{ column.name || '—' }}"</em>
                </label>
                <select :id="`vsm-select-${index}`" class="vsm-card__select" @change="onSelectChange">
                    <option value="">{{ messages.columns.selectPlaceholder }}</option>
                    <option
                        v-for="f in availableFields"
                        :key="f.key"
                        :value="f.key"
                    >
                        {{ f.label }}{{ f.requireColumn ? ' *' : '' }}
                    </option>
                    <option value="ignore">{{ messages.columns.ignoreOption }}</option>
                </select>
                <button class="vsm-card__ignore-link" type="button" @click="emit('ignore')">
                    {{ messages.columns.ignoreColumn }}
                </button>
            </slot>
        </div>

        <!-- Data preview -->
        <div class="vsm-card__preview">
            <table class="vsm-card__table" :aria-label="`${messages.columns.columnLabel} &quot;${column.name || '—'}&quot;`">
                <tbody>
                    <tr v-for="(row, i) in column.previewData" :key="i">
                        <td class="vsm-card__cell">{{ row || '—' }}</td>
                    </tr>
                    <tr v-if="column.previewData.length === 0">
                        <td class="vsm-card__cell vsm-card__cell--empty">—</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ColumnState, SchemaField, Messages, Icons } from '../types';
import IconAlert from '../icons/IconAlert.vue';
import IconBan from '../icons/IconBan.vue';
import IconCheck from '../icons/IconCheck.vue';

const props = defineProps<{
    column: ColumnState;
    index: number;
    fields: SchemaField[];
    takenKeys: Set<string>;
    messages: Messages;
    icons?: Icons;
}>();

const emit = defineEmits<{
    assign: [fieldKey: string];
    ignore: [];
    clear: [];
}>();

const resolvedIcons = computed(() => ({
    unassigned: props.icons?.unassigned ?? IconAlert,
    ignored: props.icons?.ignored ?? IconBan,
    assigned: props.icons?.assigned ?? IconCheck,
}));

const assignedField = computed(() =>
    props.column.assignedKey ? props.fields.find((f) => f.key === props.column.assignedKey) ?? null : null,
);

const availableFields = computed(() =>
    props.fields.filter((f) => !props.takenKeys.has(f.key) || f.key === props.column.assignedKey),
);

const cardClass = computed(() => ({
    'vsm-card--unassigned': props.column.assignedKey === null,
    'vsm-card--ignored': props.column.assignedKey === 'ignore',
    'vsm-card--assigned': props.column.assignedKey !== null && props.column.assignedKey !== 'ignore',
}));

function onSelectChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    if (!val) return;
    if (val === 'ignore') {
        emit('ignore');
    } else {
        emit('assign', val);
    }
    (e.target as HTMLSelectElement).value = '';
}
</script>

<style scoped>
.vsm-card {
    display: flex;
    flex-direction: column;
    min-width: 220px;
    max-width: 280px;
    flex-shrink: 0;
    border: 2px solid var(--vsm-border-color, #e5e7eb);
    border-radius: var(--vsm-radius, 8px);
    background: var(--vsm-card-bg, #fff);
    padding: 16px;
    gap: 12px;
    transition: border-color 0.15s;
}

.vsm-card--assigned {
    border-color: var(--vsm-success-color, #22c55e);
}

.vsm-card--ignored {
    border-color: var(--vsm-warning-color, #f59e0b);
    opacity: 0.75;
}

.vsm-card__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 48px;
}

.vsm-card__status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    font-weight: 600;
}

.vsm-card__status--unassigned {
    color: var(--vsm-danger-color, #ef4444);
}

.vsm-card__status--assigned {
    color: var(--vsm-success-color, #16a34a);
}

.vsm-card__status--ignored {
    color: var(--vsm-warning-color, #d97706);
}

.vsm-card__status-icon {
    flex-shrink: 0;
}

.vsm-card__change-link,
.vsm-card__ignore-link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 0.8125rem;
    color: var(--vsm-link-color, #3b82f6);
    text-decoration: underline;
    text-align: left;
}

.vsm-card__column-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--vsm-text-color, #111827);
    word-break: break-word;
}

.vsm-card__select-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.vsm-card__select-label {
    font-size: 0.8125rem;
    color: var(--vsm-muted-color, #6b7280);
}

.vsm-card__select {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--vsm-border-color, #d1d5db);
    border-radius: var(--vsm-radius-sm, 4px);
    background: var(--vsm-input-bg, #fff);
    font-size: 0.875rem;
    color: var(--vsm-text-color, #111827);
    cursor: pointer;
}

.vsm-card__preview {
    flex: 1;
    overflow: hidden;
}

.vsm-card__table {
    width: 100%;
    border-collapse: collapse;
}

.vsm-card__cell {
    padding: 6px 0;
    font-size: 0.8125rem;
    color: var(--vsm-text-color, #374151);
    border-bottom: 1px solid var(--vsm-border-color, #f3f4f6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
}

.vsm-card__cell--empty {
    color: var(--vsm-muted-color, #9ca3af);
}
</style>
