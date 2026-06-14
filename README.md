# @dazzadev/vue-sheet-mapper

A Vue 3 component that lets users map columns from an Excel or CSV file to a schema you define. Drop it in, give it your field list, and it handles the file upload, column preview, auto-matching, validation, and structured output.

**[Live demo →](https://dazza-dev.github.io/vue-sheet-mapper/)**

## Features

- **Excel & CSV** — supports `.xlsx`, `.xls`, and `.csv`
- **Auto-match** — maps columns to fields by label or aliases (accent-insensitive)
- **Preview** — shows the first N data rows per column while the user maps
- **Validation** — enforces required fields and ensures every column is assigned or ignored
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
    @mapped="onMapped"
    @error="(e) => console.error(e)"
  />
</template>
```

---

## Props

| Prop                | Type                                   | Default | Description                                                                                                  |
| ------------------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `fields`            | `SchemaField[]`                        | —       | **Required.** The target schema your file columns map to.                                                    |
| `locale`            | `'en' \| 'es' \| 'fr' \| 'pt' \| 'nl'` | `'en'`  | UI language.                                                                                                 |
| `messages`          | `MessagesOverride`                     | —       | Override individual strings for the active locale.                                                           |
| `icons`             | `Icons`                                | —       | Replace any default icon with your own component.                                                            |
| `matcher`           | `MatcherFn`                            | —       | Custom auto-match function. Replaces the built-in label/alias matcher.                                       |
| `transform`         | `TransformFn`                          | —       | Convert each data row before `@mapped` fires. Return `null` to exclude a row.                                |
| `previewRows`       | `number`                               | `5`     | How many data rows to show in each column card.                                                              |
| `defaultHasHeaders` | `boolean`                              | `true`  | Whether the first row is treated as a header on load and after reset.                                        |
| `autoIgnore`        | `boolean`                              | `false` | Automatically set unmatched columns to "ignore" after auto-matching.                                         |
| `autoConfirm`       | `boolean`                              | `false` | Emit `@mapped` immediately if all columns are valid after auto-matching, without showing the confirm button. |
| `maxFileSize`       | `number`                               | —       | Maximum file size in bytes. Files larger than this are rejected before parsing.                              |
| `maxRows`           | `number`                               | —       | Maximum number of data rows allowed. Files with more rows are rejected after parsing.                        |

---

## Events

| Event             | Payload                                           | Description                                                                                                                       |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@mapped`         | `MappedResult[] \| unknown[]`                     | Emitted after successful validation. Returns `MappedResult[]` by default, or the output of your `transform` function if provided. |
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

### `MappedResult`

One entry in the `@mapped` output (when no `transform` is provided).

```typescript
interface MappedResult {
  field: string; // the SchemaField.key this column was mapped to
  columnName: string; // the original column name from the file
  data: string[]; // all data rows for this column (header row excluded)
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

The built-in auto-matcher normalizes column names (lowercase, no accents, alphanumeric only) and does an exact comparison against each field's `label` and `aliases`. To replace it entirely, pass a `matcher` function.

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

const contactTransform: TransformFn<{
  full_name: string;
  email: string;
  phone: string;
}> = (row) => {
  if (!row.first_name) return null; // skip empty rows
  return {
    full_name: `${row.first_name.trim()} ${row.last_name?.trim() ?? ""}`.trim(),
    email: row.email?.toLowerCase().trim() ?? "",
    phone: row.phone?.replace(/\D/g, "") ?? "",
  };
};
```

```vue
<SheetMapper
  :fields="fields"
  :transform="contactTransform"
  @mapped="onMapped"
/>
```

```typescript
// output with transform
function onMapped(rows: unknown[]) {
  // [{ full_name: 'Ana García', email: 'ana@mail.com', phone: '3001234567' }, ...]
}
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

Use `useSheetMapper` directly when you need full control over the UI.

```vue
<script setup lang="ts">
import { useSheetMapper, autoMatch, toRows } from "@dazzadev/vue-sheet-mapper";
import type { SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
];

const {
  columns, // Ref<ColumnState[]>
  hasHeaders, // Ref<boolean>
  loading, // Ref<boolean>
  error, // Ref<SheetMapperError | null>
  file, // Ref<File | null>
  hasFile, // ComputedRef<boolean>
  loadFile, // (file: File) => Promise<void>
  assignField, // (columnIndex: number, fieldKey: string | null) => void
  ignoreColumn, // (columnIndex: number) => void
  clearColumn, // (columnIndex: number) => void
  toggleHeaders, // () => void
  validate, // () => MappedResult[] | null
  reset, // () => void
} = useSheetMapper(fields, {
  previewRows: 5,
  defaultHasHeaders: true,
  autoIgnore: false,
  maxFileSize: 10 * 1024 * 1024,
  maxRows: 10_000,
  matcher: autoMatch, // or your own MatcherFn
  columnLabel: (i) => `Col ${i + 1}`, // name for headerless columns
});

function onFileInput(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) loadFile(f);
}

function submit() {
  const results = validate();
  if (results) {
    const rows = toRows(results);
    console.log(rows);
  }
}
</script>
```

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
| `MappedResult`         | Type       | Output entry per mapped column                  |
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
