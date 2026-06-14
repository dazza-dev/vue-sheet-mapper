import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import type { SchemaField, ColumnState, MappedResult, ParsedColumn, SheetMapperError, MatcherFn } from '../types';
import { parseFile } from '../utils/parseFile';
import { autoMatch } from '../utils/autoMatch';

export interface UseSheetMapperOptions {
    previewRows?: number;
    /** Called to produce the column name when the file has no headers (e.g. "Column 1"). */
    columnLabel?: (index: number) => string;
    /** Replace the built-in auto-match algorithm. Receives parsed columns + schema fields, returns Map<columnIndex, fieldKey>. */
    matcher?: MatcherFn;
    /** Automatically set unmatched columns to 'ignore' after auto-matching, so the user only deals with recognized columns. Default: false. */
    autoIgnore?: boolean;
    /** Maximum file size in bytes. Files larger than this are rejected before parsing. */
    maxFileSize?: number;
    /** Maximum number of data rows allowed. Files with more rows are rejected after parsing. */
    maxRows?: number;
    /** Initial value of hasHeaders when a file is loaded or reset. Default: true. */
    defaultHasHeaders?: boolean;
}

export interface UseSheetMapperReturn {
    columns: Ref<ColumnState[]>;
    hasHeaders: Ref<boolean>;
    loading: Ref<boolean>;
    error: Ref<SheetMapperError | null>;
    file: Ref<File | null>;
    hasFile: Ref<boolean>;
    loadFile: (file: File) => Promise<void>;
    assignField: (columnIndex: number, fieldKey: string | null) => void;
    ignoreColumn: (columnIndex: number) => void;
    clearColumn: (columnIndex: number) => void;
    toggleHeaders: () => void;
    validate: () => MappedResult[] | null;
    reset: () => void;
}

function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
}

export function useSheetMapper(fields: SchemaField[], options: UseSheetMapperOptions = {}): UseSheetMapperReturn {
    const previewRows = options.previewRows ?? 5;
    const columnLabel = options.columnLabel ?? ((i: number) => `Column ${i + 1}`);
    const matchFn: MatcherFn = options.matcher ?? autoMatch;

    const loading = ref(false);
    const error = ref<SheetMapperError | null>(null);
    const file = ref<File | null>(null);
    const defaultHasHeaders = options.defaultHasHeaders ?? true;
    const hasHeaders = ref(defaultHasHeaders);
    const columns = ref<ColumnState[]>([]);

    // Raw parsed columns kept so we can re-apply hasHeaders toggle
    let rawParsed: ParsedColumn[] = [];

    const hasFile = computed(() => file.value !== null);

    function buildColumnStates(parsed: ParsedColumn[], matches: Map<number, string>): ColumnState[] {
        return parsed.map((col, i) => ({
            name: col.name,
            previewData: col.data.slice(0, previewRows),
            data: col.data,
            assignedKey: matches.get(i) ?? (options.autoIgnore ? 'ignore' : null),
        }));
    }

    async function loadFile(f: File): Promise<void> {
        loading.value = true;
        error.value = null;
        columns.value = [];
        file.value = null;

        if (options.maxFileSize !== undefined && f.size > options.maxFileSize) {
            error.value = {
                code: 'FILE_TOO_LARGE',
                message: `File exceeds the maximum allowed size of ${formatBytes(options.maxFileSize)}.`,
                maxSize: formatBytes(options.maxFileSize),
            };
            loading.value = false;
            return;
        }

        try {
            rawParsed = await parseFile(f);
        } catch (e) {
            error.value = e as SheetMapperError;
            loading.value = false;
            return;
        }

        if (options.maxRows !== undefined) {
            const rowCount = rawParsed[0]?.data.length ?? 0;
            if (rowCount > options.maxRows) {
                error.value = {
                    code: 'TOO_MANY_ROWS',
                    message: `File has ${rowCount} rows, which exceeds the limit of ${options.maxRows}.`,
                    rowCount,
                };
                loading.value = false;
                return;
            }
        }

        file.value = f;
        hasHeaders.value = defaultHasHeaders;

        const matches = matchFn(rawParsed, fields);
        columns.value = buildColumnStates(rawParsed, matches);
        loading.value = false;
    }

    function assignField(columnIndex: number, fieldKey: string | null): void {
        const col = columns.value[columnIndex];
        if (!col) return;

        // If another column already has this field, unassign it first
        if (fieldKey && fieldKey !== 'ignore') {
            columns.value.forEach((c, i) => {
                if (i !== columnIndex && c.assignedKey === fieldKey) {
                    c.assignedKey = null;
                }
            });
        }

        col.assignedKey = fieldKey;
    }

    function ignoreColumn(columnIndex: number): void {
        assignField(columnIndex, 'ignore');
    }

    function clearColumn(columnIndex: number): void {
        assignField(columnIndex, null);
    }

    function toggleHeaders(): void {
        if (hasHeaders.value) {
            // Headers → no headers: prepend header row back into data
            columns.value.forEach((col, i) => {
                const newData = [rawParsed[i].name, ...col.data];
                const newName = columnLabel(i);
                col.data = newData;
                col.name = newName;
                col.previewData = newData.slice(0, previewRows);
                rawParsed[i] = { name: newName, data: newData };
            });
            hasHeaders.value = false;
        } else {
            // No headers → headers: shift first data row up as name
            columns.value.forEach((col, i) => {
                const newName = col.data[0] ?? '';
                const newData = col.data.slice(1);
                col.name = newName;
                col.data = newData;
                col.previewData = newData.slice(0, previewRows);
                rawParsed[i] = { name: newName, data: newData };
            });
            hasHeaders.value = true;
        }
    }

    function validate(): MappedResult[] | null {
        // All columns must be assigned or ignored
        const unassigned = columns.value.filter((c) => c.assignedKey === null).map((c) => c.name);
        if (unassigned.length > 0) {
            error.value = {
                code: 'UNASSIGNED_COLUMNS',
                message: 'Some columns have no assignment.',
                unassignedColumns: unassigned,
            };
            return null;
        }

        // All required fields must be mapped
        const mappedKeys = new Set(
            columns.value.filter((c) => c.assignedKey && c.assignedKey !== 'ignore').map((c) => c.assignedKey!),
        );
        const missing = fields.filter((f) => f.required && !mappedKeys.has(f.key)).map((f) => f.key);
        if (missing.length > 0) {
            error.value = {
                code: 'MISSING_REQUIRED_FIELDS',
                message: 'Required fields are not mapped.',
                missingFields: missing,
            };
            return null;
        }

        error.value = null;

        return columns.value
            .filter((c) => c.assignedKey && c.assignedKey !== 'ignore')
            .map((c) => ({
                field: c.assignedKey!,
                columnName: c.name,
                data: c.data,
            }));
    }

    function reset(): void {
        file.value = null;
        columns.value = [];
        error.value = null;
        rawParsed = [];
        hasHeaders.value = defaultHasHeaders;
    }

    return {
        columns,
        hasHeaders,
        loading,
        error,
        file,
        hasFile,
        loadFile,
        assignField,
        ignoreColumn,
        clearColumn,
        toggleHeaders,
        validate,
        reset,
    };
}
