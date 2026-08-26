<template>
    <div class="vsm">
        <!-- Step 1: Dropzone -->
        <template v-if="!hasFile">
            <SheetDropzone
                :file="file"
                :messages="msgs"
                accept=".csv,.xls,.xlsx"
                :icons="resolvedIcons"
                @file-selected="onFileSelected"
                @reset="reset"
            >
                <template v-for="(_, name) in $slots" #[name]="slotProps">
                    <slot :name="name" v-bind="slotProps ?? {}" />
                </template>
            </SheetDropzone>
        </template>

        <!-- Step 2: Column mapper -->
        <template v-else>
            <!-- Toolbar -->
            <div class="vsm__toolbar">
                <button type="button" class="vsm-btn vsm-btn--secondary vsm__change-file" @click="reset">
                    <component :is="resolvedIcons.file" width="16" height="16" />
                    {{ file?.name }}
                </button>
                <button type="button" class="vsm-btn vsm-btn--ghost" :aria-pressed="hasHeaders" @click="toggleHeaders">
                    {{ hasHeaders ? msgs.columns.toggleHasHeaders : msgs.columns.toggleNoHeaders }}
                </button>
            </div>

            <!-- Error banner -->
            <div v-if="error" class="vsm__error">
                <slot name="error" :error="error" :dismiss="() => (error = null)">
                    <div class="vsm__error-banner" role="alert">
                        <strong>{{ msgs.errors.title }}:</strong>
                        <span>{{ errorMessage }}</span>
                        <ul v-if="errorList.length" class="vsm__error-list">
                            <li v-for="item in errorList" :key="item">{{ item }}</li>
                        </ul>
                        <button class="vsm__error-dismiss" type="button" :aria-label="msgs.errors.dismiss" @click="error = null">✕</button>
                    </div>
                </slot>
            </div>

            <!-- Column cards (horizontal scroll) -->
            <div class="vsm__columns">
                <ColumnCard
                    v-for="(col, i) in columns"
                    :key="i"
                    :column="col"
                    :index="i"
                    :fields="fields"
                    :taken-keys="takenKeys"
                    :messages="msgs"
                    :icons="resolvedIcons"
                    @assign="(key) => assignField(i, key)"
                    @ignore="ignoreColumn(i)"
                    @clear="clearColumn(i)"
                >
                    <template v-if="$slots['column-header']" #header="slotProps">
                        <slot name="column-header" v-bind="slotProps" />
                    </template>
                    <template v-if="$slots['column-select']" #select="slotProps">
                        <slot name="column-select" v-bind="slotProps" />
                    </template>
                </ColumnCard>
            </div>

            <!-- Confirm button -->
            <div class="vsm__footer">
                <slot name="confirm" :validate="handleValidate" :loading="loading">
                    <button type="button" class="vsm-btn vsm-btn--primary vsm-btn--lg" :disabled="loading" @click="handleValidate">
                        <component :is="resolvedIcons.confirm" width="18" height="18" />
                        {{ msgs.confirm }}
                    </button>
                </slot>
            </div>
        </template>

        <!-- Loading overlay while parsing -->
        <div v-if="loading && !hasFile" class="vsm__loading" role="status" :aria-label="msgs.loading">
            <component :is="resolvedIcons.spinner" class="vsm__spinner" width="32" height="32" aria-hidden="true" />
        </div>

        <!-- Parse error (before file is accepted) -->
        <div v-if="error && !hasFile" class="vsm__parse-error">
            <slot name="error" :error="error" :dismiss="() => (error = null)">
                <div class="vsm__error-banner" role="alert">
                    <strong>{{ msgs.errors.title }}:</strong>
                    <span>{{ errorMessage }}</span>
                    <button class="vsm__error-dismiss" type="button" :aria-label="msgs.errors.dismiss" @click="error = null">✕</button>
                </div>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SchemaField, MappedResult, MappingOutput, Locale, MessagesOverride, Icons, MatcherFn, TransformFn } from '../types';
import { toRows } from '../utils/toRows';
import { useSheetMapper } from '../composables/useSheetMapper';
import { getMessages } from '../i18n';
import SheetDropzone from './SheetDropzone.vue';
import ColumnCard from './ColumnCard.vue';
import IconFile from '../icons/IconFile.vue';
import IconCheck from '../icons/IconCheck.vue';
import IconBan from '../icons/IconBan.vue';
import IconAlert from '../icons/IconAlert.vue';
import IconSpinner from '../icons/IconSpinner.vue';
import IconUpload from '../icons/IconUpload.vue';

const props = withDefaults(
    defineProps<{
        fields: SchemaField[];
        previewRows?: number;
        locale?: Locale;
        messages?: MessagesOverride;
        icons?: Icons;
        matcher?: MatcherFn;
        autoIgnore?: boolean;
        autoConfirm?: boolean;
        transform?: TransformFn;
        maxFileSize?: number;
        maxRows?: number;
        defaultHasHeaders?: boolean;
        /** What `@mapped` emits: the row-oriented results ('rows', default), or the raw
         *  file plus the mapping dictionary ('mapping'). Ignores `transform` when 'mapping'. */
        output?: 'rows' | 'mapping';
        /** TextDecoder label (e.g. 'shift-jis') forcing the encoding of CSV/text files.
         *  Detected automatically when omitted; ignored for .xlsx and .xls. */
        encoding?: string;
    }>(),
    {
        previewRows: 5,
        locale: 'en',
        output: 'rows',
        // Vue casts an absent Boolean prop to false, so this has to be explicit —
        // otherwise the mapper always starts in "no headers" mode.
        defaultHasHeaders: true,
    },
);

const emit = defineEmits<{
    mapped: [results: MappedResult[] | MappingOutput | unknown[]];
    error: [error: import('../types').SheetMapperError];
    'file-picked': [file: File];
    'columns-loaded': [columns: { name: string; assignedKey: string | null }[]];
    reset: [];
}>();

const msgs = computed(() => getMessages(props.locale, props.messages));

const resolvedIcons = computed(() => ({
    upload: props.icons?.upload ?? IconUpload,
    file: props.icons?.file ?? IconFile,
    assigned: props.icons?.assigned ?? IconCheck,
    ignored: props.icons?.ignored ?? IconBan,
    unassigned: props.icons?.unassigned ?? IconAlert,
    spinner: props.icons?.spinner ?? IconSpinner,
    confirm: props.icons?.confirm ?? IconCheck,
}));

const {
    columns,
    hasHeaders,
    loading,
    error,
    file,
    hasFile,
    takenKeys,
    mapping,
    loadFile,
    assignField,
    ignoreColumn,
    clearColumn,
    toggleHeaders,
    validate,
    reset,
} = useSheetMapper(() => props.fields, {
    previewRows: props.previewRows,
    columnLabel: (i) => msgs.value.columns.columnFallback.replace('{n}', String(i + 1)),
    matcher: props.matcher,
    autoIgnore: props.autoIgnore,
    maxFileSize: props.maxFileSize,
    maxRows: props.maxRows,
    defaultHasHeaders: props.defaultHasHeaders,
    encoding: props.encoding,
});

const errorMessage = computed(() => {
    if (!error.value) return '';
    const e = error.value;
    const m = msgs.value.errors;
    switch (e.code) {
        case 'INVALID_FILE_TYPE': return m.invalidFileType;
        case 'FILE_READ_ERROR': return m.fileReadError;
        case 'FILE_TOO_LARGE': return (m.fileTooLarge ?? 'File too large. Maximum: {size}.').replace('{size}', e.maxSize ?? '');
        case 'TOO_MANY_ROWS': return (m.tooManyRows ?? 'Too many rows. Maximum: {max}.').replace('{max}', String(props.maxRows ?? ''));
        case 'NO_WORKSHEET': return m.noWorksheet;
        case 'EMPTY_WORKSHEET': return m.emptyWorksheet;
        case 'UNASSIGNED_COLUMNS': return m.unassignedColumns;
        case 'MISSING_REQUIRED_FIELDS': return m.missingRequiredFields;
        case 'NO_FILE': return m.noFile;
        default: return e.message;
    }
});

const errorList = computed<string[]>(() => {
    if (!error.value) return [];
    if (error.value.missingFields) {
        return error.value.missingFields.map(
            (k) => props.fields.find((f) => f.key === k)?.label ?? k,
        );
    }
    if (error.value.unassignedColumns) return error.value.unassignedColumns;
    return [];
});

async function onFileSelected(f: File) {
    emit('file-picked', f);
    await loadFile(f);
    if (error.value) {
        emit('error', error.value);
        return;
    }
    emit('columns-loaded', columns.value.map((c) => ({ name: c.name, assignedKey: c.assignedKey })));
    if (props.autoConfirm) handleValidate();
}

function handleValidate() {
    const results = validate();
    if (!results) {
        if (error.value) emit('error', error.value);
        return;
    }

    if (props.output === 'mapping') {
        emit('mapped', {
            file: file.value!,
            mapping: mapping.value,
            hasHeaders: hasHeaders.value,
        });
        return;
    }

    if (props.transform) {
        const rows = toRows(results);
        const transformed = rows.map(props.transform).filter((r): r is NonNullable<typeof r> => r !== null);
        emit('mapped', transformed);
    } else {
        emit('mapped', results);
    }
}
</script>

<style>
/* Design tokens — scoped to the component root to avoid global leakage.
   Override by targeting .vsm or any ancestor selector in your app. */
.vsm {
    --vsm-primary: #3b82f6;
    --vsm-primary-hover: #2563eb;
    --vsm-success-color: #16a34a;
    --vsm-warning-color: #d97706;
    --vsm-danger-color: #ef4444;
    --vsm-text-color: #111827;
    --vsm-muted-color: #6b7280;
    --vsm-border-color: #e5e7eb;
    --vsm-card-bg: #fff;
    --vsm-dropzone-bg: #f9fafb;
    --vsm-dropzone-hover-bg: #eff6ff;
    --vsm-input-bg: #fff;
    --vsm-link-color: #3b82f6;
    --vsm-radius: 8px;
    --vsm-radius-sm: 4px;
}

/* Shared button styles */
.vsm-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: var(--vsm-radius, 8px);
    border: 1px solid transparent;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, opacity 0.15s;
    text-decoration: none;
    line-height: 1.4;
}

.vsm-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.vsm-btn--primary {
    background: var(--vsm-primary, #3b82f6);
    color: #fff;
}

.vsm-btn--primary:not(:disabled):hover {
    background: var(--vsm-primary-hover, #2563eb);
}

.vsm-btn--secondary {
    background: #fff;
    border-color: var(--vsm-border-color, #e5e7eb);
    color: var(--vsm-text-color, #111827);
}

.vsm-btn--secondary:not(:disabled):hover {
    background: var(--vsm-dropzone-bg, #f9fafb);
}

.vsm-btn--ghost {
    background: transparent;
    color: var(--vsm-link-color, #3b82f6);
    font-size: 0.8125rem;
    padding: 4px 8px;
}

.vsm-btn--ghost:hover {
    text-decoration: underline;
}

.vsm-btn--lg {
    padding: 10px 28px;
    font-size: 1rem;
}
</style>

<style scoped>
.vsm {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: inherit;
}

.vsm__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
}

.vsm__change-file {
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vsm__columns {
    display: flex;
    flex-direction: row;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: thin;
    scrollbar-color: var(--vsm-border-color, #e5e7eb) transparent;
}

.vsm__footer {
    display: flex;
    justify-content: center;
    padding-top: 8px;
}

.vsm__loading {
    display: flex;
    justify-content: center;
    padding: 24px;
}

.vsm__spinner {
    color: var(--vsm-primary, #3b82f6);
    animation: vsm-spin 1s linear infinite;
}

@keyframes vsm-spin {
    to { transform: rotate(360deg); }
}

.vsm__error-banner {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: var(--vsm-radius, 8px);
    font-size: 0.875rem;
    color: #991b1b;
    position: relative;
}

.vsm__error-list {
    margin: 4px 0 0;
    padding-left: 16px;
}

.vsm__error-dismiss {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    color: #991b1b;
    font-size: 1rem;
    flex-shrink: 0;
    padding: 0 2px;
}

.vsm__parse-error {
    margin-top: 16px;
}
</style>
