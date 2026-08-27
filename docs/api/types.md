# TypeScript types

## `SchemaField`

Defines one field in your target schema.

```typescript
interface SchemaField {
  key: string; // used in MappedResult.field and as the transform row key
  label: string; // shown in the dropdown and column card
  requireColumn?: boolean; // validate() fails if no column is mapped to this field
  aliases?: string[]; // extra names for auto-matching (e.g. column headers in other languages)
}
```

## Two kinds of column index

Two different numbers travel through the library. Mixing them up corrupts an import, so they are named apart:

| | What it is | Where you see it |
| --- | --- | --- |
| **Position in the `columns` array** | The n-th card the user sees | `assignField`, `ignoreColumn`, `clearColumn`, and the keys of the `Map` a `MatcherFn` returns |
| **`index`** | The 0-based position of the column in the actual spreadsheet | `ParsedColumn.index`, `ColumnState.index`, and the keys of `mapping` |

They differ because **a column whose data cells are all empty is dropped**: it never shows up in the UI, but it still occupies its position in the file. A sheet with `A=Description`, `B=Notes` (blank), `C=Price` produces two columns whose `index` values are `0` and `2` — so anything you send to a backend that will re-read the file stays aligned with it.

## `ParsedColumn`

One column as returned by `parseFile`.

```typescript
interface ParsedColumn {
  index: number; // 0-based position in the source spreadsheet — stable when empty columns are dropped
  name: string; // value of the first row (the header, when the file has one)
  data: string[]; // all rows below the header
}
```

## `ColumnState`

The state of one column card in the mapper UI.

```typescript
interface ColumnState {
  index: number; // 0-based position in the source spreadsheet — this is what `mapping` sends
  name: string; // column name from the file (or "Column 1" when the file has no headers)
  previewData: string[]; // the first `previewRows` rows, shown in the card
  data: string[]; // all rows in this column
  assignedKey: string | null; // schema field key, null = unassigned, 'ignore' = skipped
}
```

## `MappedResult`

One entry in the `@mapped` output (when no `transform` is provided).

```typescript
interface MappedResult {
  field: string; // the SchemaField.key this column was mapped to
  columnName: string; // the original column name from the file
  data: string[]; // all data rows for this column (header row excluded)
}
```

## `MappingOutput`

The `@mapped` payload when `output="mapping"`.

```typescript
interface MappingOutput {
  file: File; // the original, untransformed File
  mapping: Record<number, string>; // spreadsheet column index → schema field key
  hasHeaders: boolean; // whether row 1 of the file is a header row
}
```

## `SheetMapperError`

```typescript
interface SheetMapperError {
  code: SheetMapperErrorCode;
  message: string;
  missingFields?: string[]; // field keys (MISSING_REQUIRED_FIELDS)
  unassignedColumns?: string[]; // column names (UNASSIGNED_COLUMNS)
  maxSize?: string; // human-readable limit, e.g. "5 MB" (FILE_TOO_LARGE)
  rowCount?: number; // actual row count found (TOO_MANY_ROWS)
}

type SheetMapperErrorCode =
  | "FILE_READ_ERROR"
  | "INVALID_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "TOO_MANY_ROWS"
  | "NO_WORKSHEET"
  | "EMPTY_WORKSHEET"
  | "UNASSIGNED_COLUMNS"
  | "MISSING_REQUIRED_FIELDS"
  | "NO_FILE";
```

## `MatcherFn`

```typescript
type MatcherFn = (
  columns: ParsedColumn[],
  fields: SchemaField[],
) => Map<number, string>; // Map<columnIndex, fieldKey>
```

The keys of the returned `Map` are **positions in the `columns` array it receives** — not `ParsedColumn.index`. Return `0` for the first column you were handed, whatever its position in the spreadsheet.

## `TransformFn`

```typescript
type TransformFn<T = Record<string, string>> = (
  row: Record<string, string>, // { fieldKey: value } for each mapped column
) => T | null; // return null to exclude this row from the output
```

## `Icons`

```typescript
import type { Component } from "vue";

interface Icons {
  upload?: Component; // cloud/arrow icon in the empty dropzone
  file?: Component; // document icon shown after a file is loaded
  assigned?: Component; // checkmark on a mapped column card
  ignored?: Component; // crossed-circle on an ignored column card
  unassigned?: Component; // alert on an unmapped column card
  spinner?: Component; // loading spinner during file parsing
  confirm?: Component; // icon inside the confirm/import button
}
```

---
