<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/dazza-dev/vue-sheet-mapper/main/demo/public/logo-wordmark-dark.svg">
    <img src="https://raw.githubusercontent.com/dazza-dev/vue-sheet-mapper/main/demo/public/logo-wordmark.svg" alt="vue-sheet-mapper" width="340">
  </picture>
</p>

<p align="center">
  A Vue 3 component that lets users map columns from an Excel or CSV file to a schema you define.<br>
  Drop it in, give it your field list, and it handles the file upload, column preview,<br>
  auto-matching, validation, and structured output.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper"><img src="https://img.shields.io/npm/v/@dazzadev/vue-sheet-mapper?color=42b883&label=npm" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper"><img src="https://img.shields.io/bundlephobia/minzip/@dazzadev/vue-sheet-mapper?color=35495e&label=gzip" alt="bundle size"></a>
  <img src="https://img.shields.io/npm/l/@dazzadev/vue-sheet-mapper?color=35495e" alt="license">
</p>

<p align="center">
  <strong><a href="https://dazza-dev.github.io/vue-sheet-mapper/">Live demo →</a></strong>
  &nbsp;·&nbsp;
  <a href="CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/dazza-dev/vue-sheet-mapper/main/demo/public/screenshot.png" alt="Column mapping screen: each spreadsheet column is a card with a data preview — matched columns in green, an ignored column in orange, and an unmatched one waiting for the user to pick a field" width="900">
</p>

## Features

- **Excel & CSV** — supports `.xlsx`, `.xls`, and `.csv`
- **Auto-match** — maps columns to fields by key, label or aliases (accent-insensitive)
- **Reactive schemas** — pass a `ref`, `computed` or getter; fields can arrive from your API after the file is picked
- **Preview** — shows the first N data rows per column while the user maps
- **Validation** — enforces required fields and ensures every column is assigned or ignored
- **Two output modes** — the mapped rows, or the raw file plus a mapping dictionary for server-side imports
- **i18n** — 5 built-in locales (en, es, fr, pt, nl) with per-key overrides
- **Customizable icons** — replace any icon with your own Vue component
- **Custom matcher** — replace the auto-match algorithm entirely
- **Transform** — convert column output to row objects before `@mapped` fires
- **Headless** — use `useSheetMapper` composable without any UI
- **TypeScript** — full type declarations included

---

## Installation

```bash
npm install @dazzadev/vue-sheet-mapper xlsx
```

```bash
yarn add @dazzadev/vue-sheet-mapper xlsx
```

```bash
pnpm add @dazzadev/vue-sheet-mapper xlsx
```

> `xlsx` is a peer dependency — you must install it alongside the package.

Import the stylesheet once in your app entry:

```typescript
import "@dazzadev/vue-sheet-mapper/style.css";
```

---

## Quick start

```vue
<script setup lang="ts">
import { SheetMapper } from "@dazzadev/vue-sheet-mapper";
import type { MappedResult, SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  {
    key: "first_name",
    label: "First name",
    required: true,
    aliases: ["nombre", "name"],
  },
  {
    key: "last_name",
    label: "Last name",
    required: true,
    aliases: ["apellido"],
  },
  { key: "email", label: "Email", aliases: ["correo", "mail"] },
  { key: "phone", label: "Phone", aliases: ["telefono", "cel"] },
];

function onMapped(results: MappedResult[]) {
  // results is an array — one entry per mapped column
  // [{ field: 'first_name', columnName: 'Nombres', data: ['Ana', 'Luis'] }, ...]
  console.log(results);
}
</script>

<template>
  <SheetMapper
    :fields="fields"
    locale="en"
    @mapped="(results) => onMapped(results as MappedResult[])"
    @error="(e) => console.error(e)"
  />
</template>
```

> `@mapped` is typed as the union of everything it can carry (`MappedResult[] | MappingOutput | unknown[]`), because `transform` and `output` change its shape. TypeScript can't narrow it from the props, so cast it to the shape you configured — as above.

---

## Props

| Prop                | Type                                   | Default | Description                                                                                                  |
| ------------------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `fields`            | `SchemaField[]`                        | —       | **Required.** The target schema your file columns map to.                                                    |
| `locale`            | `'en' \| 'es' \| 'fr' \| 'pt' \| 'nl'` | `'en'`  | UI language.                                                                                                 |
| `messages`          | `MessagesOverride`                     | —       | Override individual strings for the active locale.                                                           |
| `icons`             | `Icons`                                | —       | Replace any default icon with your own component.                                                            |
| `matcher`           | `MatcherFn`                            | —       | Custom auto-match function. Replaces the built-in key/label/alias matcher.                                   |
| `output`            | `'rows' \| 'mapping'`                  | `'rows'`| What `@mapped` emits. `'rows'` sends the mapped column data; `'mapping'` sends `{ file, mapping, hasHeaders }` so your backend does the reading. `transform` is ignored when `'mapping'`. |
| `transform`         | `TransformFn`                          | —       | Convert each data row before `@mapped` fires. Return `null` to exclude a row. Ignored when `output` is `'mapping'`. |
| `previewRows`       | `number`                               | `5`     | How many data rows to show in each column card.                                                              |
| `defaultHasHeaders` | `boolean`                              | `true`  | Whether the first row is treated as a header on load and after reset.                                        |
| `autoIgnore`        | `boolean`                              | `false` | Automatically set unmatched columns to "ignore" after auto-matching.                                         |
| `autoConfirm`       | `boolean`                              | `false` | Emit `@mapped` immediately if all columns are valid after auto-matching, without showing the confirm button. |
| `maxFileSize`       | `number`                               | —       | Maximum file size in bytes. Files larger than this are rejected before parsing.                              |
| `maxRows`           | `number`                               | —       | Maximum number of data rows allowed. Files with more rows are rejected after parsing.                        |
| `encoding`          | `string`                               | —       | `TextDecoder` label (e.g. `'shift-jis'`) forcing the encoding of CSV/text files. Detected automatically when omitted; ignored for `.xlsx` and `.xls`. |

---

## Events

| Event             | Payload                                           | Description                                                                                                                       |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@mapped`         | `MappedResult[] \| MappingOutput \| unknown[]`    | Emitted after successful validation. `MappedResult[]` by default, the output of your `transform` function if provided, or a `MappingOutput` when `output="mapping"`. |
| `@error`          | `SheetMapperError`                                | Emitted when a file or validation error occurs.                                                                                   |
| `@file-picked`    | `File`                                            | Emitted immediately when the user selects a file, before parsing.                                                                 |
| `@columns-loaded` | `{ name: string; assignedKey: string \| null }[]` | Emitted after the file is parsed and columns are shown. Includes the detected column names and their initial auto-match result.   |
| `@reset`          | —                                                 | Emitted when the user clicks "change file" and returns to the dropzone.                                                           |

---

## Slots

### `#error`

Replaces the default error banner. Receives `{ error, dismiss }`.

```vue
<SheetMapper :fields="fields">
  <template #error="{ error, dismiss }">
    <div class="my-error">
      {{ error.code }}: {{ error.message }}
      <button @click="dismiss">Dismiss</button>
    </div>
  </template>
</SheetMapper>
```

### `#confirm`

Replaces the default confirm button. Receives `{ validate, loading }`.

```vue
<SheetMapper :fields="fields">
  <template #confirm="{ validate, loading }">
    <button :disabled="loading" @click="validate">
      Import now →
    </button>
  </template>
</SheetMapper>
```

### `#column-header`

Replaces the header area of each column card. Receives `{ column, field, clear }`.

```vue
<SheetMapper :fields="fields">
  <template #column-header="{ column, field, clear }">
    <span>{{ field?.label ?? 'Unassigned' }}</span>
    <button v-if="field" @click="clear">✕</button>
  </template>
</SheetMapper>
```

### `#column-select`

Replaces the field selector dropdown in each column card. Receives `{ column, fields, onAssign, onIgnore }`.

> `fields` contains all schema fields, unfiltered. If you want to hide already-assigned fields, track assignments via `@columns-loaded` or `useSheetMapper`.

```vue
<SheetMapper :fields="fields">
  <template #column-select="{ fields, onAssign, onIgnore }">
    <select @change="(e) => onAssign((e.target as HTMLSelectElement).value)">
      <option value="">-- select --</option>
      <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
    </select>
    <button @click="onIgnore">Skip</button>
  </template>
</SheetMapper>
```

### Default slot (dropzone)

Replaces the entire dropzone UI. Receives `{ open, isDragging, file }`.

```vue
<SheetMapper :fields="fields">
  <template #default="{ open, isDragging, file }">
    <div :class="{ dragging: isDragging }" @click="open">
      <span v-if="file">{{ file.name }}</span>
      <span v-else>Drop your file here</span>
    </div>
  </template>
</SheetMapper>
```

---

## TypeScript types

### `SchemaField`

Defines one field in your target schema.

```typescript
interface SchemaField {
  key: string; // used in MappedResult.field and as the transform row key
  label: string; // shown in the dropdown and column card
  required?: boolean; // validate() fails if this field has no column assigned
  aliases?: string[]; // extra names for auto-matching (e.g. column headers in other languages)
}
```

### Two kinds of column index

Two different numbers travel through the library. Mixing them up corrupts an import, so they are named apart:

| | What it is | Where you see it |
| --- | --- | --- |
| **Position in the `columns` array** | The n-th card the user sees | `assignField`, `ignoreColumn`, `clearColumn`, and the keys of the `Map` a `MatcherFn` returns |
| **`index`** | The 0-based position of the column in the actual spreadsheet | `ParsedColumn.index`, `ColumnState.index`, and the keys of `mapping` |

They differ because **a column whose data cells are all empty is dropped**: it never shows up in the UI, but it still occupies its position in the file. A sheet with `A=Description`, `B=Notes` (blank), `C=Price` produces two columns whose `index` values are `0` and `2` — so anything you send to a backend that will re-read the file stays aligned with it.

### `ParsedColumn`

One column as returned by `parseFile`.

```typescript
interface ParsedColumn {
  index: number; // 0-based position in the source spreadsheet — stable when empty columns are dropped
  name: string; // value of the first row (the header, when the file has one)
  data: string[]; // all rows below the header
}
```

### `ColumnState`

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

### `MappedResult`

One entry in the `@mapped` output (when no `transform` is provided).

```typescript
interface MappedResult {
  field: string; // the SchemaField.key this column was mapped to
  columnName: string; // the original column name from the file
  data: string[]; // all data rows for this column (header row excluded)
}
```

### `MappingOutput`

The `@mapped` payload when `output="mapping"`.

```typescript
interface MappingOutput {
  file: File; // the original, untransformed File
  mapping: Record<number, string>; // spreadsheet column index → schema field key
  hasHeaders: boolean; // whether row 1 of the file is a header row
}
```

### `SheetMapperError`

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

### `MatcherFn`

```typescript
type MatcherFn = (
  columns: ParsedColumn[],
  fields: SchemaField[],
) => Map<number, string>; // Map<columnIndex, fieldKey>
```

The keys of the returned `Map` are **positions in the `columns` array it receives** — not `ParsedColumn.index`. Return `0` for the first column you were handed, whatever its position in the spreadsheet.

### `TransformFn`

```typescript
type TransformFn<T = Record<string, string>> = (
  row: Record<string, string>, // { fieldKey: value } for each mapped column
) => T | null; // return null to exclude this row from the output
```

### `Icons`

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

## i18n

Five locales are built in: `en`, `es`, `fr`, `pt`, `nl`. Set `locale` prop to switch.

To override individual strings, pass `messages` with only the keys you want to change. The rest fall back to the built-in locale strings.

```vue
<script setup lang="ts">
import type { MessagesOverride, Locale } from "@dazzadev/vue-sheet-mapper";

const locale = ref<Locale>("es");

const messages: MessagesOverride = {
  dropzone: {
    title: "Sube aquí tu archivo de contactos",
    button: "Seleccionar archivo",
  },
  confirm: "Importar contactos",
};
</script>

<template>
  <SheetMapper :fields="fields" :locale="locale" :messages="messages" />
</template>
```

### Per-locale overrides

If your app supports multiple languages, define overrides per locale and pass the active one:

```typescript
import type { MessagesOverride, Locale } from "@dazzadev/vue-sheet-mapper";

const customMessages: Partial<Record<Locale, MessagesOverride>> = {
  es: {
    dropzone: { title: "Sube tu archivo de contactos" },
    confirm: "Importar contactos",
  },
  en: {
    dropzone: { title: "Upload your contacts file" },
    confirm: "Import contacts",
  },
};
```

```vue
<SheetMapper :locale="locale" :messages="customMessages[locale]" />
```

### All overridable strings

```typescript
interface MessagesOverride {
  dropzone?: Partial<{
    title: string; // "Upload a file to import"
    subtitle: string; // "Drag and drop a CSV, XLS or XLSX file here"
    button: string; // "Choose a file"
    changeFile: string; // "Choose another file"
  }>;
  columns?: Partial<{
    toggleHasHeaders: string; // "This file does not include headers"
    toggleNoHeaders: string; // "This file includes headers"
    unassigned: string; // "Choose a column"
    ignored: string; // "Ignored"
    changeColumn: string; // "Change this column"
    ignoreColumn: string; // "Ignore this column"
    columnLabel: string; // "Data in column"
    selectPlaceholder: string; // "Select a field..."
    ignoreOption: string; // "Ignore"
    columnFallback: string; // "Column {n}" — used when file has no headers
  }>;
  confirm?: string; // "Confirm"
  loading?: string; // "Loading…"
  errors?: Partial<{
    title: string; // "Error"
    noFile: string;
    invalidFileType: string;
    fileReadError: string;
    noWorksheet: string;
    emptyWorksheet: string;
    unassignedColumns: string;
    missingRequiredFields: string;
    fileTooLarge: string; // supports {size} placeholder
    tooManyRows: string; // supports {max} placeholder
    dismiss: string; // aria-label for the error dismiss button
  }>;
}
```

---

## Custom icons

Pass any Vue component — from your icon library or your own SVGs. You only need to provide the icons you want to change; the rest use the defaults.

```vue
<script setup lang="ts">
import { PhUpload, PhFile, PhCheckCircle } from "@phosphor-icons/vue";
import type { Icons } from "@dazzadev/vue-sheet-mapper";

const icons: Icons = {
  upload: PhUpload,
  file: PhFile,
  confirm: PhCheckCircle,
};
</script>

<template>
  <SheetMapper :fields="fields" :icons="icons" />
</template>
```

The default icon components are also exported if you want to reference them:

```typescript
import {
  IconUpload,
  IconFile,
  IconCheck,
  IconBan,
  IconAlert,
  IconSpinner,
} from "@dazzadev/vue-sheet-mapper";
```

---

## Custom matcher

The built-in auto-matcher normalizes column names (lowercase, no accents, alphanumeric only) and does an exact comparison against each field's `key`, `label` and `aliases`. To replace it entirely, pass a `matcher` function.

> The keys of the `Map` you return are positions in the `columns` array you received, not `ParsedColumn.index`.

```typescript
import type { MatcherFn } from "@dazzadev/vue-sheet-mapper";

// Example 1 — positional: column 0 → first field, column 1 → second field
const positionalMatcher: MatcherFn = (columns, fields) => {
  const map = new Map<number, string>();
  columns.forEach((_, i) => {
    if (fields[i]) map.set(i, fields[i].key);
  });
  return map;
};

// Example 2 — fuzzy: match if column name *contains* a field label
const fuzzyMatcher: MatcherFn = (columns, fields) => {
  const map = new Map<number, string>();
  const used = new Set<string>();
  for (let i = 0; i < columns.length; i++) {
    const norm = columns[i].name.toLowerCase().replace(/\s+/g, "");
    for (const field of fields) {
      if (used.has(field.key)) continue;
      const candidates = [field.label, ...(field.aliases ?? [])];
      if (
        candidates.some((c) =>
          norm.includes(c.toLowerCase().replace(/\s+/g, "")),
        )
      ) {
        map.set(i, field.key);
        used.add(field.key);
        break;
      }
    }
  }
  return map;
};
```

```vue
<SheetMapper :fields="fields" :matcher="positionalMatcher" />
```

Import `autoMatch` if you want to compose with the default:

```typescript
import { autoMatch } from "@dazzadev/vue-sheet-mapper";
```

---

## Transform

By default `@mapped` emits column-oriented data — one entry per mapped field:

```typescript
// default output
[
  { field: "first_name", columnName: "Nombres", data: ["Ana", "Luis"] },
  {
    field: "email",
    columnName: "Correo",
    data: ["ana@mail.com", "luis@mail.com"],
  },
];
```

Use `transform` to receive row-oriented data instead:

```typescript
import type { TransformFn } from "@dazzadev/vue-sheet-mapper";

type Contact = {
  full_name: string;
  email: string;
  phone: string;
};

const contactTransform: TransformFn<Contact> = (row) => {
  if (!row.first_name) return null; // skip empty rows
  return {
    full_name: `${row.first_name.trim()} ${row.last_name?.trim() ?? ""}`.trim(),
    email: row.email?.toLowerCase().trim() ?? "",
    phone: row.phone?.replace(/\D/g, "") ?? "",
  };
};

function onMapped(rows: Contact[]) {
  // [{ full_name: 'Ana García', email: 'ana@mail.com', phone: '3001234567' }, ...]
}
```

```vue
<SheetMapper
  :fields="fields"
  :transform="contactTransform"
  @mapped="(rows) => onMapped(rows as Contact[])"
/>
```

### Manual row conversion

If you don't use `transform` but still need row-oriented data, use the exported `toRows` utility:

```typescript
import { toRows } from "@dazzadev/vue-sheet-mapper";
import type { MappedResult } from "@dazzadev/vue-sheet-mapper";

function onMapped(results: MappedResult[]) {
  const rows = toRows(results);
  // [{ first_name: 'Ana', email: 'ana@mail.com' }, ...]
}
```

---

## Output modes

`output` decides what `@mapped` hands you.

### `output="rows"` (default)

`@mapped` emits `MappedResult[]` — or the result of your `transform`, if you passed one. The file is read in the browser and the values travel as JSON.

### `output="mapping"`

`@mapped` emits a `MappingOutput`: the original `File`, the mapping dictionary, and whether row 1 is a header. Nothing is materialized into row objects, which is what you want when the file has thousands of rows and your backend is going to read it anyway.

```vue
<script setup lang="ts">
import { SheetMapper } from "@dazzadev/vue-sheet-mapper";
import type { MappingOutput, SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
];

async function onMapped(payload: MappingOutput) {
  // payload.file      -> the File the user picked, untouched
  // payload.mapping   -> { 0: 'name', 2: 'email' }  (spreadsheet column index -> field key)
  // payload.hasHeaders-> true
  await sendToMyBackend(payload);
}
</script>

<template>
  <SheetMapper
    :fields="fields"
    output="mapping"
    @mapped="(payload) => onMapped(payload as MappingOutput)"
  />
</template>
```

The library never issues a request and never builds a `FormData` — the payload is three primitives (a `File`, a `Record<number, string>` and a boolean), so it works against any backend, in any language. You decide the parameter names and the wire format.

`transform` is ignored in this mode: the two are mutually exclusive, since nothing is converted into rows.

Validation still runs before `@mapped` fires, so unassigned columns and missing required fields raise `@error` exactly as in `'rows'` mode.

> The `mapping` keys are **spreadsheet column indexes**, not positions in the `columns` array — see [Two kinds of column index](#two-kinds-of-column-index). A column whose data cells are all empty is hidden from the UI but does **not** shift the indexes your backend receives.

---

## Automatic behavior

### `autoIgnore`

Columns not matched by auto-match are automatically set to "ignore", so the user only has to deal with the columns that were recognized.

```vue
<SheetMapper :fields="fields" :auto-ignore="true" />
```

### `autoConfirm`

If all columns are valid after auto-match (all assigned or ignored, all required fields covered), `@mapped` fires immediately without showing the confirm button. If validation fails, the mapper shows normally so the user can fix it.

```vue
<SheetMapper :fields="fields" :auto-confirm="true" />
```

### Combining both

The most automated setup — zero user interaction when the file format is known:

```vue
<SheetMapper
  :fields="fields"
  :auto-ignore="true"
  :auto-confirm="true"
  :transform="myTransform"
  @mapped="saveToAPI"
/>
```

---

## File encoding

`.xlsx` and `.xls` carry their own encoding, so they always read correctly. CSV and other text files do not, and the encoding has to be inferred from the bytes.

The rules, in order:

1. A UTF-16 byte order mark wins — both LE and BE.
2. An explicit `encoding` prop wins over detection.
3. Otherwise, the file is decoded as UTF-8 when the bytes are valid UTF-8, and as Windows-1252 when they are not.

That last step matters because the two common CSV producers disagree. Excel for Windows writes Windows-1252, or UTF-8 with a BOM. Almost everything else — Google Sheets, Numbers, `pandas`, a backend export — writes UTF-8 with no BOM. Both are handled without configuration: for Windows-1252 text to pass a strict UTF-8 decode, every high byte would have to land inside a valid multi-byte sequence, which accented text does not do. Pure ASCII decodes the same either way.

Set `encoding` only for a legacy encoding the detection cannot reach, such as Shift-JIS, GB18030 or KOI8-R — those are not valid UTF-8, so they would otherwise fall back to Windows-1252 and come out garbled.

```vue
<SheetMapper :fields="fields" encoding="shift-jis" />
```

```typescript
const { loadFile } = useSheetMapper(fields, { encoding: "shift-jis" });
```

Any [`TextDecoder` label](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings) is accepted.

---

## File size limit

Reject files before parsing with `maxFileSize` (in bytes). The error message is localized and supports the `{size}` placeholder.

```vue
<!-- 5 MB limit -->
<SheetMapper :fields="fields" :max-file-size="5 * 1024 * 1024" />
```

## Row limit

Reject files with too many rows after parsing with `maxRows`. Useful when your backend or import pipeline has a processing limit. The error message is localized and supports the `{max}` placeholder.

```vue
<!-- Reject files with more than 10,000 data rows -->
<SheetMapper :fields="fields" :max-rows="10_000" />
```

> The check happens **after** parsing, so the file size limit (`maxFileSize`) is the right tool to keep large files from being read at all. Use both together for a complete guard.

```vue
<SheetMapper
  :fields="fields"
  :max-file-size="10 * 1024 * 1024"
  :max-rows="10_000"
/>
```

---

## CSS theming

All visual properties are exposed as CSS custom properties on the `.vsm` root element. Override them from your app CSS — no SCSS required.

```css
.vsm {
  --vsm-primary: #3b82f6;
  --vsm-primary-hover: #2563eb;
  --vsm-success-color: #16a34a;
  --vsm-warning-color: #d97706;
  --vsm-danger-color: #ef4444;
  --vsm-text-color: #111827;
  --vsm-muted-color: #6b7280;
  --vsm-border-color: #e5e7eb;
  --vsm-card-bg: #ffffff;
  --vsm-dropzone-bg: #f9fafb;
  --vsm-dropzone-hover-bg: #eff6ff;
  --vsm-input-bg: #ffffff;
  --vsm-link-color: #3b82f6;
  --vsm-radius: 8px;
  --vsm-radius-sm: 4px;
}
```

Override by targeting `.vsm` from your app:

```css
/* match your brand color */
.vsm {
  --vsm-primary: #7c3aed;
  --vsm-primary-hover: #6d28d9;
  --vsm-radius: 4px;
}
```

Or scope the override to a specific instance:

```vue
<div class="my-importer">
  <SheetMapper :fields="fields" />
</div>
```

```css
.my-importer .vsm {
  --vsm-primary: #7c3aed;
}
```

---

## Headless usage

Use `useSheetMapper` directly when you need full control over the UI or want to integrate with UI libraries like Vuetify, PrimeVue, Tailwind, etc.

```typescript
function useSheetMapper(
  fields: MaybeRefOrGetter<SchemaField[]>,
  options?: UseSheetMapperOptions,
): UseSheetMapperReturn;
```

### Reactive schemas

`fields` is a `MaybeRefOrGetter<SchemaField[]>`, so a static array, a `ref`, a `computed` and a getter function all work. If your schema loads asynchronously from an API or a store, auto-matching re-runs on its own when the fields arrive — the user can pick their file first and the columns get matched as soon as the schema lands.

Re-matching never overwrites a decision the user already made. Any column they assigned, ignored or cleared by hand is left untouched, and its field key is taken out of play so no other column can be auto-matched to it. Columns the user has not touched are re-derived from scratch, which means a field that **disappears** from the schema also clears the column that held it.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useSheetMapper, autoMatch, toRows } from "@dazzadev/vue-sheet-mapper";
import type { SchemaField } from "@dazzadev/vue-sheet-mapper";

// Static or reactive (e.g. ref, computed, or from an API)
const fields = ref<SchemaField[]>([
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true, aliases: ["mail", "correo"] },
  { key: "phone", label: "Phone" },
]);

const {
  columns,                // Ref<ColumnState[]>
  hasHeaders,             // Ref<boolean>
  loading,                // Ref<boolean>
  error,                  // Ref<SheetMapperError | null>
  file,                   // Ref<File | null>
  hasFile,                // ComputedRef<boolean>
  takenKeys,              // ComputedRef<Set<string>>
  unassignedColumns,      // ComputedRef<ColumnState[]>
  missingRequiredFields,  // ComputedRef<SchemaField[]>
  isValid,                // ComputedRef<boolean> (true when all columns mapped/ignored and required fields satisfied)
  mapping,                // ComputedRef<Record<number, string>> (spreadsheet column index -> fieldKey)
  loadFile,               // (file: File) => Promise<void>
  assignField,            // (columnIndex: number, fieldKey: string | null) => void — columnIndex is the position in `columns`
  ignoreColumn,           // (columnIndex: number) => void — position in `columns`
  ignoreUnassignedColumns,// () => void (sets all unassigned columns to 'ignore')
  clearColumn,            // (columnIndex: number) => void — position in `columns`
  toggleHeaders,          // () => void
  validate,               // () => MappedResult[] | null
  reset,                  // () => void
} = useSheetMapper(fields, {
  previewRows: 5,
  defaultHasHeaders: true,
  autoIgnore: false,
  maxFileSize: 10 * 1024 * 1024,
  maxRows: 10_000,
  encoding: undefined, // e.g. "shift-jis" — auto-detected when omitted
  matcher: autoMatch, // or your own MatcherFn
  columnLabel: (i) => `Col ${i + 1}`, // name for headerless columns
});

function onFileInput(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) loadFile(f);
}

// Option A: Client-side transformed JSON output
function submitClientJSON() {
  const results = validate();
  if (results) {
    const rows = toRows(results);
    console.log("Structured rows ready to send:", rows);
  }
}

// Option B: Direct backend import (file + mapping dictionary)
// Example against a Laravel backend — `header_row` is PhpSpreadsheet's own naming.
// The pieces the library gives you are plain primitives (a File, a
// Record<number, string> and a boolean), so shape the request however your
// backend wants it: Node, Go, Rails, a presigned upload — the library never
// issues a request itself.
async function submitToBackend() {
  if (!isValid.value || !file.value) return;

  const payload = new FormData();
  payload.append("file", file.value);
  payload.append("mapping", JSON.stringify(mapping.value)); // e.g. { "0": "name", "2": "email" }
  payload.append("header_row", hasHeaders.value ? "0" : "-1");

  await fetch("/api/bulk-import", { method: "POST", body: payload });
}
</script>
```

> `mapping` is keyed by the **spreadsheet column index**, not by the position in the `columns` array — see [Two kinds of column index](#two-kinds-of-column-index). Entirely empty columns are hidden from the UI but keep the remaining indexes aligned with the file your backend re-reads.

The `<SheetMapper>` component exposes the same payload without going headless — see [`output="mapping"`](#outputmapping).

---

## Global registration

```typescript
// main.ts
import { createApp } from "vue";
import { VueSheetMapperPlugin } from "@dazzadev/vue-sheet-mapper";
import "@dazzadev/vue-sheet-mapper/style.css";
import App from "./App.vue";

createApp(App).use(VueSheetMapperPlugin).mount("#app");
```

After registering the plugin, `<SheetMapper>` is available globally without importing it in each component.

---

## Exported API reference

| Export                 | Kind       | Description                                     |
| ---------------------- | ---------- | ----------------------------------------------- |
| `SheetMapper`          | Component  | Main component                                  |
| `useSheetMapper`       | Composable | Headless logic                                  |
| `VueSheetMapperPlugin` | Plugin     | For `app.use()` global registration             |
| `autoMatch`            | Function   | Default auto-match algorithm                    |
| `toRows`               | Function   | Convert `MappedResult[]` to row objects         |
| `parseFile`            | Function   | Parse an Excel/CSV `File` into `ParsedColumn[]` |
| `getMessages`          | Function   | Resolve locale strings with optional overrides  |
| `IconUpload`           | Component  | Default upload icon                             |
| `IconFile`             | Component  | Default file icon                               |
| `IconCheck`            | Component  | Default check/confirm icon                      |
| `IconBan`              | Component  | Default ignore icon                             |
| `IconAlert`            | Component  | Default unassigned icon                         |
| `IconSpinner`          | Component  | Default spinner icon                            |
| `SchemaField`          | Type       | Field definition                                |
| `UseSheetMapperOptions`| Type       | Options for `useSheetMapper`                    |
| `UseSheetMapperReturn` | Type       | Return object from `useSheetMapper`             |
| `MappedResult`         | Type       | Output entry per mapped column                  |
| `MappingOutput`        | Type       | `@mapped` payload when `output="mapping"`       |
| `ParsedColumn`         | Type       | Raw column from the parsed file                 |
| `ColumnState`          | Type       | UI state per column card                        |
| `SheetMapperError`     | Type       | Error object                                    |
| `SheetMapperErrorCode` | Type       | Error code union                                |
| `Messages`             | Type       | Full i18n messages object                       |
| `MessagesOverride`     | Type       | Deep-partial i18n overrides                     |
| `Locale`               | Type       | `'en' \| 'es' \| 'fr' \| 'pt' \| 'nl'`          |
| `Icons`                | Type       | Icon override map                               |
| `MatcherFn`            | Type       | Custom matcher function signature               |
| `TransformFn`          | Type       | Row transform function signature                |

---

## License

MIT
