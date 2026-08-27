# Headless usage

Use `useSheetMapper` directly when you need full control over the UI or want to integrate with UI libraries like Vuetify, PrimeVue, Tailwind, etc.

```typescript
function useSheetMapper(
  fields: MaybeRefOrGetter<SchemaField[]>,
  options?: UseSheetMapperOptions,
): UseSheetMapperReturn;
```

## Reactive schemas

`fields` is a `MaybeRefOrGetter<SchemaField[]>`, so a static array, a `ref`, a `computed` and a getter function all work. If your schema loads asynchronously from an API or a store, auto-matching re-runs on its own when the fields arrive — the user can pick their file first and the columns get matched as soon as the schema lands.

Re-matching never overwrites a decision the user already made. Any column they assigned, ignored or cleared by hand is left untouched, and its field key is taken out of play so no other column can be auto-matched to it. Columns the user has not touched are re-derived from scratch, which means a field that **disappears** from the schema also clears the column that held it.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useSheetMapper, autoMatch, toRows } from "@dazzadev/vue-sheet-mapper";
import type { SchemaField } from "@dazzadev/vue-sheet-mapper";

// Static or reactive (e.g. ref, computed, or from an API)
const fields = ref<SchemaField[]>([
  { key: "name", label: "Name", requireColumn: true },
  { key: "email", label: "Email", requireColumn: true, aliases: ["mail", "correo"] },
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
  isValid,                // ComputedRef<boolean> (all columns assigned or ignored, and every required field mapped)
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

> `mapping` is keyed by the **spreadsheet column index**, not by the position in the `columns` array — see [Two kinds of column index](/api/types#two-kinds-of-column-index). Entirely empty columns are hidden from the UI but keep the remaining indexes aligned with the file your backend re-reads.

The `<SheetMapper>` component exposes the same payload without going headless — see [`output="mapping"`](/guide/output-modes#output-mapping).

---
