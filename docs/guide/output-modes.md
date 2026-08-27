# Output modes

`output` decides what `@mapped` hands you.

## `output="rows"` (default)

`@mapped` emits `MappedResult[]` — or the result of your `transform`, if you passed one. The file is read in the browser and the values travel as JSON.

## `output="mapping"`

`@mapped` emits a `MappingOutput`: the original `File`, the mapping dictionary, and whether row 1 is a header. Nothing is materialized into row objects, which is what you want when the file has thousands of rows and your backend is going to read it anyway.

```vue
<script setup lang="ts">
import { SheetMapper } from "@dazzadev/vue-sheet-mapper";
import type { MappingOutput, SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  { key: "name", label: "Name", requireColumn: true },
  { key: "email", label: "Email", requireColumn: true },
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

> The `mapping` keys are **spreadsheet column indexes**, not positions in the `columns` array — see [Two kinds of column index](/api/types#two-kinds-of-column-index). A column whose data cells are all empty is hidden from the UI but does **not** shift the indexes your backend receives.

---
