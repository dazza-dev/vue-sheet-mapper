<template>
    <div class="vsm" :aria-busy="loading">
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
                    <component :is="resolvedIcons.file" width="16" height="16" aria-hidden="true" />
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

            <!-- Problems reported by validateRows -->
            <div v-if="issues.length" class="vsm__issues">
                <slot name="issues" :issues="issues" :row="issueRow" :recheck="handleValidate">
                    <div class="vsm__issues-panel" role="alert">
                        <strong class="vsm__issues-title">
                            {{ msgs.issues.title.replace('{n}', String(affectedRows)) }}
                        </strong>
                        <ul class="vsm__issues-list">
                            <li v-for="(issue, i) in shownIssues" :key="i" class="vsm__issue">
                                <span class="vsm__issue-row">{{ msgs.issues.row.replace('{n}', String(issueRow(issue))) }}</span>
                                <span v-if="issue.field" class="vsm__issue-field">{{ fieldLabel(issue.field) }}</span>
                                <span class="vsm__issue-message">{{ issue.message }}</span>
                            </li>
                        </ul>
                        <p v-if="issues.length > shownIssues.length" class="vsm__issues-more">
                            {{ msgs.issues.more.replace('{n}', String(shownIssues.length)).replace('{total}', String(issues.length)) }}
                        </p>
                    </div>
                </slot>
            </div>

            <!-- Column cards (horizontal scroll) -->
            <div class="vsm__columns" role="list">
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
                    <button
                        type="button"
                        class="vsm-btn vsm-btn--primary vsm-btn--lg"
                        :disabled="loading || checkingRows"
                        @click="handleValidate"
                    >
                        <component :is="resolvedIcons.confirm" width="18" height="18" aria-hidden="true" />
                        {{ checkingRows ? msgs.issues.checking : (issues.length ? msgs.issues.retry : msgs.confirm) }}
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
import type { SchemaField, MappedResult, MappingOutput, Locale, MessagesOverride, Icons, MatcherFn, TransformFn, RowIssue, RowValidator } from '../types';
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
        /** Checks the mapped rows and reports problems. The library never inspects
         *  values itself — bring zod, yup, your own function or your backend. */
        validateRows?: RowValidator;
        /** How many problems to list at once. Default 50. */
        maxIssuesShown?: number;
    }>(),
    {
        previewRows: 5,
        locale: 'en',
        output: 'rows',
        maxIssuesShown: 50,
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
    invalid: [issues: RowIssue[]];
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
    issues,
    checkingRows,
    checkRows,
    issueRow,
    reset,
} = useSheetMapper(() => props.fields, {
    // Getters, not values: a plain object literal would freeze each prop at its
    // mount-time value and later changes would be ignored without a trace.
    get previewRows() { return props.previewRows; },
    columnLabel: (i) => msgs.value.columns.columnFallback.replace('{n}', String(i + 1)),
    get matcher() { return props.matcher; },
    get autoIgnore() { return props.autoIgnore; },
    get maxFileSize() { return props.maxFileSize; },
    get maxRows() { return props.maxRows; },
    get defaultHasHeaders() { return props.defaultHasHeaders; },
    get encoding() { return props.encoding; },
    get validateRows() { return props.validateRows; },
});

const errorMessage = computed(() => {
    if (!error.value) return '';
    const e = error.value;
    const m = msgs.value.errors;
    switch (e.code) {
        case 'INVALID_FILE_TYPE': return m.invalidFileType;
        case 'FILE_READ_ERROR': return m.fileReadError;
        case 'FILE_TOO_LARGE': return m.fileTooLarge.replace('{size}', e.maxSize ?? '');
        case 'TOO_MANY_ROWS': return m.tooManyRows.replace('{max}', String(props.maxRows ?? ''));
        case 'NO_WORKSHEET': return m.noWorksheet;
        case 'EMPTY_WORKSHEET': return m.emptyWorksheet;
        case 'UNASSIGNED_COLUMNS': return m.unassignedColumns;
        case 'MISSING_REQUIRED_FIELDS': return m.missingRequiredFields;
        case 'DUPLICATE_ASSIGNMENTS': return m.duplicateAssignments;
        case 'NO_FILE': return m.noFile;
        default: return e.message;
    }
});

const shownIssues = computed(() => issues.value.slice(0, props.maxIssuesShown));
const affectedRows = computed(() => new Set(issues.value.map((i) => i.index)).size);

function fieldLabel(key: string): string {
    return props.fields.find((f) => f.key === key)?.label ?? key;
}

const errorList = computed<string[]>(() => {
    if (!error.value) return [];
    if (error.value.missingFields) {
        return error.value.missingFields.map(
            (k) => props.fields.find((f) => f.key === k)?.label ?? k,
        );
    }
    if (error.value.duplicateFields) {
        return error.value.duplicateFields.map(
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

async function handleValidate() {
    const results = validate();
    if (!results) {
        if (error.value) emit('error', error.value);
        return;
    }

    if (props.validateRows) {
        const found = await checkRows();
        if (found.length) {
            emit('invalid', found);
            return;
        }
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
    --vsm-primary: #2563eb;
    --vsm-primary-hover: #1d4ed8;
    --vsm-success-color: #15803d;
    --vsm-warning-color: #b45309;
    --vsm-danger-color: #dc2626;
    --vsm-text-color: #111827;
    --vsm-muted-color: #6b7280;
    --vsm-border-color: #e5e7eb;
    --vsm-card-bg: #fff;
    --vsm-dropzone-bg: #f9fafb;
    --vsm-dropzone-hover-bg: #eff6ff;
    --vsm-input-bg: #fff;
    --vsm-link-color: #2563eb;
    --vsm-radius: 8px;
    --vsm-radius-sm: 4px;
}

.vsm__issues-panel {
    border: 1px solid var(--vsm-danger-color);
    border-radius: var(--vsm-radius);
    background: var(--vsm-card-bg);
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.vsm__issues-title {
    color: var(--vsm-danger-color);
    font-size: 0.9375rem;
}

.vsm__issues-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 260px;
    overflow-y: auto;
}

.vsm__issue {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 0.875rem;
    color: var(--vsm-text-color);
}

.vsm__issue-row {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--vsm-muted-color);
}

.vsm__issue-field {
    flex-shrink: 0;
    font-weight: 600;
}

.vsm__issues-more {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--vsm-muted-color);
}

/* Shared button styles */
.vsm-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: var(--vsm-radius);
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
    background: var(--vsm-primary);
    color: #fff;
}

.vsm-btn--primary:not(:disabled):hover {
    background: var(--vsm-primary-hover);
}

.vsm-btn--secondary {
    background: var(--vsm-card-bg);
    border-color: var(--vsm-border-color);
    color: var(--vsm-text-color);
}

.vsm-btn--secondary:not(:disabled):hover {
    background: var(--vsm-dropzone-bg);
}

.vsm-btn--ghost {
    background: transparent;
    color: var(--vsm-link-color);
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
    scrollbar-color: var(--vsm-border-color) transparent;
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
    color: var(--vsm-primary);
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
    border-radius: var(--vsm-radius);
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
