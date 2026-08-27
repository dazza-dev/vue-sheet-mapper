# Modos de salida

`output` decide qué te entrega `@mapped`.

## `output="rows"` (por defecto)

`@mapped` emite `MappedResult[]` — o el resultado de tu `transform`, si pasaste
uno. El archivo se lee en el navegador y los valores viajan como JSON.

## `output="mapping"`

`@mapped` emite un `MappingOutput`: el `File` original, el diccionario de mapeo y
si la fila 1 es encabezado. Nada se materializa en objetos de fila, que es lo que
quieres cuando el archivo tiene miles de filas y tu backend va a leerlo de todos
modos.

```vue
<script setup lang="ts">
import { SheetMapper } from "@dazzadev/vue-sheet-mapper";
import type { MappingOutput, SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  { key: "name", label: "Nombre", requireColumn: true },
  { key: "email", label: "Correo", requireColumn: true },
];

async function onMapped(payload: MappingOutput) {
  // payload.file       -> el File que eligió el usuario, intacto
  // payload.mapping    -> { 0: 'name', 2: 'email' }  (índice de columna en la hoja -> campo)
  // payload.hasHeaders -> true
  await enviarAMiBackend(payload);
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

La librería nunca hace una petición ni construye un `FormData`: el payload son
tres primitivos (un `File`, un `Record<number, string>` y un booleano), así que
sirve contra cualquier backend, en cualquier lenguaje. Los nombres de los
parámetros y el formato los decides tú.

`transform` se ignora en este modo: son mutuamente excluyentes, porque nada se
convierte en filas.

La validación sigue corriendo antes de que se emita `@mapped`, así que las
columnas sin asignar y los campos obligatorios sin mapear levantan `@error`
exactamente igual que en modo `'rows'`.

> Las claves de `mapping` son **índices de columna en la hoja**, no posiciones
> dentro del array `columns` — mira [Dos clases de índice de columna](/es/api/types#dos-clases-de-indice-de-columna).
> Una columna cuyas celdas de datos están todas vacías se oculta de la interfaz
> pero **no** desplaza los índices que recibe tu backend.
