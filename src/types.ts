// ─── Schema definition ───────────────────────────────────────────────────────

/** A field in the target schema that file columns can be mapped to. */
export interface SchemaField {
    /** Unique key sent in the output (e.g. "document_number"). */
    key: string;
    /** Human-readable label shown in the column selector (e.g. "Cédula"). */
    label: string;
    /**
     * If true, validate() fails unless some column is mapped to this field.
     *
     * This is a check on the mapping, not on the data: it does not require every
     * row to carry a value, and an empty cell passes. Row contents are emitted
     * as-is.
     */
    requireColumn?: boolean;
    /** Extra names used for auto-matching (case-insensitive, trimmed). */
    aliases?: string[];
}

// ─── Parsed file ─────────────────────────────────────────────────────────────

/** One column as extracted from the spreadsheet. */
export interface ParsedColumn {
    /** 0-based position of this column in the source spreadsheet.
     *  Stable even when entirely empty columns are dropped. */
    index: number;
    /** The value of the first row (used as column header when hasHeaders = true). */
    name: string;
    /** All data rows below the header (or all rows if hasHeaders = false). */
    data: string[];
}

// ─── Internal column state ────────────────────────────────────────────────────

/** State for one column card in the mapper UI. */
export interface ColumnState {
    /** 0-based position of this column in the source spreadsheet.
     *  This is what `mapping` sends to the backend — NOT the position in the `columns` array. */
    index: number;
    /** Original column name from the file (may be "Column 1" when no headers). */
    name: string;
    /** Rows shown in the preview section. */
    previewData: string[];
    /** All rows in this column. */
    data: string[];
    /** The schema field key currently assigned, null = unassigned, 'ignore' = skipped. */
    assignedKey: string | null;
}

// ─── Output ───────────────────────────────────────────────────────────────────

/** One entry in the mapped result emitted after validation. */
export interface MappedResult {
    /** The SchemaField.key this column was mapped to. */
    field: string;
    /** The original column name from the spreadsheet. */
    columnName: string;
    /** All row values for this column (data rows only, not the header). */
    data: string[];
}

/** Payload emitted by `@mapped` when the `output` prop is set to 'mapping'. */
export interface MappingOutput {
    /** The original, untransformed File. */
    file: File;
    /** Spreadsheet column index → schema field key. */
    mapping: Record<number, string>;
    /** Whether row 1 of the file is a header row. */
    hasHeaders: boolean;
}

// ─── Row validation ──────────────────────────────────────────────────────────

/** One problem found in the data, reported by a RowValidator. */
export interface RowIssue {
    /**
     * Position in the `rows` array the validator received, 0-based.
     *
     * Not the spreadsheet row: the component resolves that for display, since
     * it is the only place that knows whether row 1 is a header.
     */
    index: number;
    /** Schema field key the problem belongs to. Used to name the column. */
    field?: string;
    /** Message shown to the user, already in their language. */
    message: string;
}

/**
 * Checks the mapped data and returns the problems found.
 *
 * Receives every row at once so cross-row rules (duplicate ids) and batched
 * remote checks are possible; per-row validation is a `flatMap` away. Return an
 * empty array when the data is fine.
 *
 * The library never inspects values itself — bring zod, yup, your own function
 * or your backend. It only routes what you report back to the right row.
 */
export type RowValidator = (
    rows: Record<string, string>[],
) => RowIssue[] | Promise<RowIssue[]>;

// ─── Errors ───────────────────────────────────────────────────────────────────

export type SheetMapperErrorCode =
    | 'FILE_READ_ERROR'
    | 'NO_WORKSHEET'
    | 'EMPTY_WORKSHEET'
    | 'INVALID_FILE_TYPE'
    | 'FILE_TOO_LARGE'
    | 'TOO_MANY_ROWS'
    | 'UNASSIGNED_COLUMNS'
    | 'MISSING_REQUIRED_FIELDS'
    | 'DUPLICATE_ASSIGNMENTS'
    | 'NO_FILE';

export interface SheetMapperError {
    code: SheetMapperErrorCode;
    message: string;
    /** Field keys with requireColumn that no column is mapped to (only for MISSING_REQUIRED_FIELDS). */
    missingFields?: string[];
    /** Column names that have no assignment (only for UNASSIGNED_COLUMNS). */
    unassignedColumns?: string[];
    /** Field keys assigned to more than one column (only for DUPLICATE_ASSIGNMENTS). */
    duplicateFields?: string[];
    /** Human-readable max size string, e.g. "5 MB" (only for FILE_TOO_LARGE). */
    maxSize?: string;
    /** Actual row count found (only for TOO_MANY_ROWS). */
    rowCount?: number;
}

// ─── Transform ───────────────────────────────────────────────────────────────

/**
 * Transform a single data row (field → value map) before it's included in
 * the @mapped output. Return null to exclude that row from the result.
 * Use `toRows` (also exported) if you need to convert MappedResult[] manually.
 */
export type TransformFn<T = Record<string, string>> = (row: Record<string, string>) => T | null;

// ─── Matcher ─────────────────────────────────────────────────────────────────

/**
 * Custom auto-match function. Receives the parsed columns and the schema
 * fields, and must return a Map<columnIndex, fieldKey> with the initial
 * assignments. Use this to replace the built-in normalized exact-match with
 * fuzzy matching, positional mapping, or any domain-specific logic.
 *
 * The keys of the returned Map are **positions in the `columns` array it
 * receives**, not `ParsedColumn.index` (the position in the spreadsheet).
 *
 * Import `autoMatch` from the package if you want to compose with the default.
 */
export type MatcherFn = (columns: ParsedColumn[], fields: SchemaField[]) => Map<number, string>;

// ─── Icons ────────────────────────────────────────────────────────────────────

import type { Component } from 'vue';

/** Override any default icon with your own Vue component or icon library component. */
export interface Icons {
    /** Cloud upload icon shown in the empty dropzone. */
    upload?: Component;
    /** File document icon shown when a file is loaded. */
    file?: Component;
    /** Checkmark icon for the assigned state on column cards. */
    assigned?: Component;
    /** Crossed-circle icon for the ignored state on column cards. */
    ignored?: Component;
    /** Info-circle icon for the unassigned state on column cards. */
    unassigned?: Component;
    /** Spinner icon shown while parsing the file. */
    spinner?: Component;
    /** Icon shown inside the confirm/validate button. */
    confirm?: Component;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export type Locale = 'en' | 'es' | 'fr' | 'pt' | 'nl';

/** Deep-partial override — any subset of any nested key is valid. */
export interface MessagesOverride {
    dropzone?: Partial<{
        title: string;
        subtitle: string;
        button: string;
        changeFile: string;
    }>;
    columns?: Partial<{
        toggleHasHeaders: string;
        toggleNoHeaders: string;
        unassigned: string;
        ignored: string;
        changeColumn: string;
        ignoreColumn: string;
        columnLabel: string;
        selectPlaceholder: string;
        ignoreOption: string;
        columnFallback?: string;
    }>;
    confirm?: string;
    issues?: Partial<{
        title: string;
        row: string;
        more: string;
        checking: string;
        retry: string;
    }>;
    errors?: Partial<{
        title: string;
        noFile: string;
        invalidFileType: string;
        fileReadError: string;
        noWorksheet: string;
        emptyWorksheet: string;
        unassignedColumns: string;
        missingRequiredFields: string;
        duplicateAssignments: string;
        fileTooLarge: string;
        tooManyRows?: string;
        dismiss?: string;
    }>;
    loading?: string;
}

export interface Messages {
    dropzone: {
        title: string;
        subtitle: string;
        button: string;
        changeFile: string;
    };
    columns: {
        toggleHasHeaders: string;
        toggleNoHeaders: string;
        unassigned: string;
        ignored: string;
        changeColumn: string;
        ignoreColumn: string;
        columnLabel: string;
        selectPlaceholder: string;
        ignoreOption: string;
        /** Column name when the file has no headers. Use {n} as the column number placeholder. */
        columnFallback: string;
    };
    confirm: string;
    issues: {
        /** Use {n} as the placeholder for the number of problems. */
        title: string;
        /** Use {n} as the placeholder for the spreadsheet row number. */
        row: string;
        /** Use {n} and {total} for how many of the problems are listed. */
        more: string;
        checking: string;
        retry: string;
    };
    errors: {
        title: string;
        noFile: string;
        invalidFileType: string;
        fileReadError: string;
        noWorksheet: string;
        emptyWorksheet: string;
        unassignedColumns: string;
        missingRequiredFields: string;
        duplicateAssignments: string;
        /** Use {size} as placeholder for the human-readable limit (e.g. "5 MB"). */
        fileTooLarge: string;
        /** Use {max} as placeholder for the row limit. */
        tooManyRows: string;
        dismiss: string;
    };
    loading: string;
}
