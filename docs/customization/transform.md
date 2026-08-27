# Transform

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

## Manual row conversion

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
