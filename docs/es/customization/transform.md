# Transform

Por defecto `@mapped` emite `MappedResult[]`, que está orientado a columnas. Usa
`transform` para recibir datos orientados a filas.

```typescript
import type { TransformFn } from "@dazzadev/vue-sheet-mapper";

type Contacto = {
  full_name: string;
  email: string;
  phone: string;
};

const contactTransform: TransformFn<Contacto> = (row) => {
  if (!row.first_name) return null; // saltar filas vacías
  return {
    full_name: `${row.first_name.trim()} ${row.last_name?.trim() ?? ""}`.trim(),
    email: row.email?.toLowerCase().trim() ?? "",
    phone: row.phone?.replace(/\D/g, "") ?? "",
  };
};

function onMapped(rows: Contacto[]) {
  // [{ full_name: 'Ana García', email: 'ana@mail.com', phone: '3001234567' }, ...]
}
```

```vue
<SheetMapper
  :fields="fields"
  :transform="contactTransform"
  @mapped="(rows) => onMapped(rows as Contacto[])"
/>
```

Devolver `null` excluye esa fila del resultado.

`transform` se ignora con `output="mapping"`: son mutuamente excluyentes, porque
en ese modo nada se convierte en filas.

## Conversión manual

Si no usas `transform` pero aun así necesitas datos por filas, usa la utilidad
`toRows`:

```typescript
import { toRows } from "@dazzadev/vue-sheet-mapper";
import type { MappedResult } from "@dazzadev/vue-sheet-mapper";

function onMapped(results: MappedResult[]) {
  const rows = toRows(results);
  // [{ first_name: 'Ana', email: 'ana@mail.com', ... }, ...]
}
```
