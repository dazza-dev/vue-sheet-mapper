import { ref, shallowRef, computed, watch, toValue } from 'vue';
import type { Ref, ComputedRef, MaybeRefOrGetter } from 'vue';
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
    /** TextDecoder label (e.g. 'shift-jis') forcing the encoding of CSV/text files. Detected automatically when omitted; ignored for .xlsx and .xls. */
    encoding?: string;
}

export interface UseSheetMapperReturn {
    /** Array of reactive column states for the uploaded file. */
    columns: Ref<ColumnState[]>;
    /** Whether the first row of the file is currently treated as headers. */
    hasHeaders: Ref<boolean>;
    /** True while a file is being read and parsed. */
    loading: Ref<boolean>;
    /** Error state if parsing or validation failed. */
    error: Ref<SheetMapperError | null>;
    /** The currently loaded File instance, or null. */
    file: Ref<File | null>;
    /** True when a file has been loaded and parsed. */
    hasFile: ComputedRef<boolean>;
    /** Set of schema field keys that are currently assigned to at least one column (excluding 'ignore'). */
    takenKeys: ComputedRef<Set<string>>;
    /** Columns that have not yet been assigned to a schema field or marked as ignored. */
    unassignedColumns: ComputedRef<ColumnState[]>;
    /** Fields with requireColumn: true that no column is mapped to yet. */
    missingRequiredFields: ComputedRef<SchemaField[]>;
    /** True if all columns are assigned or ignored, and all required fields are mapped. */
    isValid: ComputedRef<boolean>;
    /** Mapping dictionary mapping spreadsheet column index (`ColumnState.index`) to field key
     *  (omitting ignored and unassigned columns). Not the position in the `columns` array. */
    mapping: ComputedRef<Record<number, string>>;
    /** Read and parse an Excel (.xlsx, .xls) or CSV file, running auto-matching against the schema. */
    loadFile: (file: File) => Promise<void>;
    /** Assign a schema field key (or 'ignore' or null) to a column.
     *  `columnIndex` is the position in the `columns` array, not `ColumnState.index`. */
    assignField: (columnIndex: number, fieldKey: string | null) => void;
    /** Mark a column as ignored.
     *  `columnIndex` is the position in the `columns` array, not `ColumnState.index`. */
    ignoreColumn: (columnIndex: number) => void;
    /** Mark all currently unassigned columns as ignored in one action. */
    ignoreUnassignedColumns: () => void;
    /** Clear the assignment of a column back to unassigned (null).
     *  `columnIndex` is the position in the `columns` array, not `ColumnState.index`. */
    clearColumn: (columnIndex: number) => void;
    /** Toggle whether row 1 is treated as headers or data rows. */
    toggleHeaders: () => void;
    /** Validate the mapping. Returns MappedResult[] on success, or sets error and returns null on failure. */
    validate: () => MappedResult[] | null;
    /** Reset state back to dropzone mode, clearing file and columns. */
    reset: () => void;
}

function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
}

/**
 * Headless composable that encapsulates all sheet parsing, column auto-matching,
 * manual assignment, header toggling, and validation logic.
 *
 * Supports static arrays as well as reactive schemas (`ref`, `computed`, or getters).
 * Automatically re-evaluates auto-matching when schema fields change or arrive asynchronously.
 */
export function useSheetMapper(
    fields: MaybeRefOrGetter<SchemaField[]>,
    options: UseSheetMapperOptions = {}
): UseSheetMapperReturn {
    // Read through to `options` on every use instead of capturing: these arrive
    // as component props, and a prop that silently keeps its mount-time value is
    // a bug the consumer cannot see.
    const previewRows = () => options.previewRows ?? 5;
    const columnLabel = (i: number) => (options.columnLabel ?? ((n: number) => `Column ${n + 1}`))(i);
    const matchFn = (): MatcherFn => options.matcher ?? autoMatch;

    const loading = ref(false);
    const error = ref<SheetMapperError | null>(null);
    // shallowRef: a File is an opaque handle. Deep reactivity would hand consumers
    // a Proxy instead of the File itself, which FormData and fetch reject.
    const file = shallowRef<File | null>(null);
    const defaultHasHeaders = () => options.defaultHasHeaders ?? true;
    const hasHeaders = ref(defaultHasHeaders());
    const columns = ref<ColumnState[]>([]);

    // Raw parsed columns kept so we can re-apply hasHeaders toggle
    let rawParsed: ParsedColumn[] = [];

    // Columns the user explicitly assigned, ignored or cleared.
    // Auto-matching never overwrites them.
    const touched = new Set<number>();

    const hasFile = computed(() => file.value !== null);

    function buildColumnStates(parsed: ParsedColumn[], matches: Map<number, string>): ColumnState[] {
        return parsed.map((col, i) => ({
            index: col.index,
            name: col.name,
            previewData: col.data.slice(0, previewRows()),
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
            rawParsed = await parseFile(f, options.encoding);
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
        hasHeaders.value = defaultHasHeaders();

        const matches = matchFn()(rawParsed, toValue(fields));
        columns.value = buildColumnStates(rawParsed, matches);
        touched.clear();
        loading.value = false;
    }

    /** Internal setter: applies the assignment without marking the column as touched. */
    function setAssignment(columnIndex: number, fieldKey: string | null): void {
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

    /** `columnIndex` is the position in the `columns` array — what the UI iterates —
     *  not `ColumnState.index` (the position in the spreadsheet). */
    function assignField(columnIndex: number, fieldKey: string | null): void {
        if (!columns.value[columnIndex]) return;
        touched.add(columnIndex);
        setAssignment(columnIndex, fieldKey);
    }

    /** `columnIndex` is the position in the `columns` array, not `ColumnState.index`. */
    function ignoreColumn(columnIndex: number): void {
        assignField(columnIndex, 'ignore');
    }

    function ignoreUnassignedColumns(): void {
        columns.value.forEach((col, i) => {
            if (col.assignedKey === null) {
                touched.add(i);
                col.assignedKey = 'ignore';
            }
        });
    }

    /** `columnIndex` is the position in the `columns` array, not `ColumnState.index`. */
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
                col.previewData = newData.slice(0, previewRows());
                rawParsed[i] = { index: rawParsed[i].index, name: newName, data: newData };
            });
            hasHeaders.value = false;
        } else {
            // No headers → headers: shift first data row up as name
            columns.value.forEach((col, i) => {
                const newName = col.data[0] ?? '';
                const newData = col.data.slice(1);
                col.name = newName;
                col.data = newData;
                col.previewData = newData.slice(0, previewRows());
                rawParsed[i] = { index: rawParsed[i].index, name: newName, data: newData };
            });
            hasHeaders.value = true;
        }
    }

    // Automatically re-evaluate auto-matching when fields change (e.g. async fetch from backend)
    watch(
        () => toValue(fields),
        (newFields) => {
            if (!rawParsed.length || !columns.value.length) return;

            // Keys the user already decided on are off-limits to auto-matching
            const reserved = new Set<string>();
            columns.value.forEach((col, i) => {
                if (touched.has(i) && col.assignedKey && col.assignedKey !== 'ignore') {
                    reserved.add(col.assignedKey);
                }
            });

            const matches = matchFn()(rawParsed, newFields);
            columns.value.forEach((col, i) => {
                if (touched.has(i)) return;
                const key = matches.get(i);
                col.assignedKey = key && !reserved.has(key) ? key : null;
            });
        },
        { deep: true }
    );

    const takenKeys = computed<Set<string>>(() => {
        const s = new Set<string>();
        columns.value.forEach((c) => {
            if (c.assignedKey && c.assignedKey !== 'ignore') s.add(c.assignedKey);
        });
        return s;
    });

    const unassignedColumns = computed(() => columns.value.filter((c) => c.assignedKey === null));

    const missingRequiredFields = computed(() =>
        toValue(fields).filter((f) => f.requireColumn && !takenKeys.value.has(f.key))
    );

    const isValid = computed(
        () => columns.value.length > 0 && unassignedColumns.value.length === 0 && missingRequiredFields.value.length === 0
    );

    const mapping = computed<Record<number, string>>(() => {
        const map: Record<number, string> = {};
        columns.value.forEach((col) => {
            if (col.assignedKey && col.assignedKey !== 'ignore') {
                map[col.index] = col.assignedKey;
            }
        });
        return map;
    });

    function validate(): MappedResult[] | null {
        // All columns must be assigned or ignored
        const unassigned = unassignedColumns.value.map((c) => c.name);
        if (unassigned.length > 0) {
            error.value = {
                code: 'UNASSIGNED_COLUMNS',
                message: 'Some columns have no assignment.',
                unassignedColumns: unassigned,
            };
            return null;
        }

        // No field may be claimed by two columns. assignField prevents it, but a
        // custom `matcher` can return a Map that does — and toRows would then
        // silently drop one of the columns.
        const seen = new Set<string>();
        const duplicates = new Set<string>();
        columns.value.forEach((c) => {
            if (!c.assignedKey || c.assignedKey === 'ignore') return;
            if (seen.has(c.assignedKey)) duplicates.add(c.assignedKey);
            seen.add(c.assignedKey);
        });
        if (duplicates.size > 0) {
            error.value = {
                code: 'DUPLICATE_ASSIGNMENTS',
                message: 'The same field is assigned to more than one column.',
                duplicateFields: [...duplicates],
            };
            return null;
        }

        // All required fields must be mapped
        const missing = missingRequiredFields.value.map((f) => f.key);
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
        touched.clear();
        error.value = null;
        rawParsed = [];
        hasHeaders.value = defaultHasHeaders();
    }

    return {
        columns,
        hasHeaders,
        loading,
        error,
        file,
        hasFile,
        takenKeys,
        unassignedColumns,
        missingRequiredFields,
        isValid,
        mapping,
        loadFile,
        assignField,
        ignoreColumn,
        ignoreUnassignedColumns,
        clearColumn,
        toggleHeaders,
        validate,
        reset,
    };
}
