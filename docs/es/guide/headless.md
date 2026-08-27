# Uso headless

Usa `useSheetMapper` directamente cuando necesites control total de la interfaz, o
quieras integrarlo con Vuetify, PrimeVue, Tailwind o lo que uses.

```typescript
function useSheetMapper(
  fields: MaybeRefOrGetter<SchemaField[]>,
  options?: UseSheetMapperOptions,
): UseSheetMapperReturn;
```

## Esquemas reactivos

`fields` es un `MaybeRefOrGetter<SchemaField[]>`, así que sirven un array estático,
un `ref`, un `computed` o una función getter. Si tu esquema se carga de forma
asíncrona desde una API o un store, el auto-match se re-ejecuta solo cuando los
campos llegan: el usuario puede elegir su archivo primero y las columnas se
asignan en cuanto el esquema aterriza.

El re-match nunca pisa una decisión que el usuario ya tomó. Cualquier columna que
haya asignado, ignorado o limpiado a mano se queda como está, y su clave queda
fuera de juego para que ninguna otra columna se le asigne. Las columnas que el
usuario no ha tocado se recalculan desde cero, lo que significa que un campo que
**desaparece** del esquema también limpia la columna que lo tenía.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useSheetMapper, autoMatch, toRows } from "@dazzadev/vue-sheet-mapper";
import type { SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields = ref<SchemaField[]>([
  { key: "name", label: "Nombre", requireColumn: true },
  { key: "email", label: "Correo", requireColumn: true, aliases: ["mail"] },
]);

const {
  columns,                 // Ref<ColumnState[]>
  hasHeaders,              // Ref<boolean>
  loading,                 // Ref<boolean>
  error,                   // Ref<SheetMapperError | null>
  file,                    // Ref<File | null>
  hasFile,                 // ComputedRef<boolean>
  takenKeys,               // ComputedRef<Set<string>>
  unassignedColumns,       // ComputedRef<ColumnState[]>
  missingRequiredFields,   // ComputedRef<SchemaField[]>
  isValid,                 // ComputedRef<boolean>
  mapping,                 // ComputedRef<Record<number, string>> (índice en la hoja -> campo)
  loadFile,                // (file: File) => Promise<void>
  assignField,             // (columnIndex, fieldKey) => void — posición en `columns`
  ignoreColumn,            // (columnIndex) => void — posición en `columns`
  ignoreUnassignedColumns, // () => void
  clearColumn,             // (columnIndex) => void — posición en `columns`
  toggleHeaders,           // () => void
  validate,                // () => MappedResult[] | null
  issues,                  // Ref<RowIssue[]>
  checkingRows,            // Ref<boolean>
  checkRows,               // () => Promise<RowIssue[]>
  issueRow,                // (issue) => number — fila real en la hoja
  reset,                   // () => void
} = useSheetMapper(fields, {
  previewRows: 5,
  defaultHasHeaders: true,
  autoIgnore: false,
  maxFileSize: 10 * 1024 * 1024,
  maxRows: 10_000,
  encoding: undefined,   // p. ej. "shift-jis" — se detecta sola si se omite
  matcher: autoMatch,    // o tu propia MatcherFn
  validateRows: undefined,
  columnLabel: (i) => `Col ${i + 1}`, // nombre de columna cuando no hay encabezados
});

function onFileInput(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) loadFile(f);
}

// Opción A: JSON transformado en el cliente
function enviarComoJSON() {
  const results = validate();
  if (results) {
    const rows = toRows(results);
    console.log("filas listas para enviar:", rows);
  }
}

// Opción B: el archivo crudo más el diccionario de mapeo
// Ejemplo contra un backend Laravel — `header_row` es nomenclatura de PhpSpreadsheet.
// Lo que te da la librería son primitivos, así que dale a la petición la forma que
// tu backend espere: Node, Go, Rails, una subida firmada — la librería nunca hace
// la petición por su cuenta.
async function enviarAlBackend() {
  if (!isValid.value || !file.value) return;

  const payload = new FormData();
  payload.append("file", file.value);
  payload.append("mapping", JSON.stringify(mapping.value)); // p. ej. { "0": "name", "2": "email" }
  payload.append("header_row", hasHeaders.value ? "0" : "-1");

  await fetch("/api/bulk-import", { method: "POST", body: payload });
}
</script>
```

> `mapping` está indexado por el **índice de columna en la hoja**, no por la
> posición dentro del array `columns` — mira
> [Dos clases de índice de columna](/es/api/types#dos-clases-de-indice-de-columna).
> Las columnas totalmente vacías se ocultan de la interfaz pero mantienen
> alineados los índices restantes con el archivo que relee tu backend.

El componente `<SheetMapper>` expone el mismo payload sin ir a headless — mira
[`output="mapping"`](/es/guide/output-modes#output-mapping).
