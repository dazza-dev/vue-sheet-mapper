# Primeros pasos

```vue
<script setup lang="ts">
import { SheetMapper } from "@dazzadev/vue-sheet-mapper";
import "@dazzadev/vue-sheet-mapper/style.css";
import type { MappedResult, SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  { key: "document_number", label: "Cédula", requireColumn: true, aliases: ["cedula", "documento"] },
  { key: "first_name", label: "Nombres", requireColumn: true, aliases: ["nombre"] },
  { key: "email", label: "Correo", aliases: ["email", "mail"] },
];

function onMapped(results: MappedResult[]) {
  // una entrada por cada columna asignada
  // [{ field: 'email', columnName: 'Correo', data: ['ana@mail.com', ...] }, ...]
}
</script>

<template>
  <SheetMapper
    :fields="fields"
    locale="es"
    @mapped="(results) => onMapped(results as MappedResult[])"
    @error="(e) => console.error(e)"
  />
</template>
```

> `@mapped` está tipado como la unión de todo lo que puede transportar
> (`MappedResult[] | MappingOutput | unknown[]`), porque `transform` y `output`
> cambian su forma. TypeScript no puede deducirlo desde las props, así que haz un
> cast a la forma que configuraste, como arriba.

## Qué hace el componente

1. Muestra una zona para soltar el archivo y acepta `.xlsx`, `.xls` y `.csv`.
2. Lo parsea, detectando la codificación, y transpone las filas a columnas.
3. Compara el nombre de cada columna contra la `key`, la `label` y los `aliases`
   de cada campo, sin distinguir acentos, y preasigna las que reconoce.
4. Deja al usuario asignar, cambiar o ignorar cada columna.
5. Al confirmar, valida el mapeo y emite `@mapped`.
