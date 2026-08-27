# Quick start

```vue
<script setup lang="ts">
import { SheetMapper } from "@dazzadev/vue-sheet-mapper";
import type { MappedResult, SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  {
    key: "first_name",
    label: "First name",
    requireColumn: true,
    aliases: ["nombre", "name"],
  },
  {
    key: "last_name",
    label: "Last name",
    requireColumn: true,
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
