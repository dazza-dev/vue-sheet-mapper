# Tipos de TypeScript

## `SchemaField`

```typescript
interface SchemaField {
  key: string;              // clave única que sale en el resultado
  label: string;            // texto visible en el selector de columna
  requireColumn?: boolean;  // validate() falla si ningún campo apunta aquí
  aliases?: string[];       // nombres extra para el auto-match
}
```

## Dos clases de índice de columna

Por la librería viajan dos números distintos. Confundirlos corrompe una
importación, así que están nombrados aparte:

| | Qué es | Dónde lo ves |
| --- | --- | --- |
| **Posición en el array `columns`** | La enésima tarjeta que ve el usuario | `assignField`, `ignoreColumn`, `clearColumn`, y las claves del `Map` que devuelve un `MatcherFn` |
| **`index`** | La posición real de la columna en la hoja de cálculo, base 0 | `ParsedColumn.index`, `ColumnState.index`, y las claves de `mapping` |

Difieren porque **una columna cuyas celdas de datos están todas vacías se
descarta**: no aparece en la interfaz, pero sigue ocupando su posición en el
archivo. Una hoja con `A=Descripción`, `B=Notas` (vacía) y `C=Precio` produce dos
columnas cuyos `index` son `0` y `2`, de modo que lo que envíes a un backend que
va a releer el archivo sigue alineado con él.

## `ParsedColumn`

Una columna tal y como la devuelve `parseFile`.

```typescript
interface ParsedColumn {
  index: number;  // posición en la hoja original, estable aunque se descarten vacías
  name: string;   // valor de la primera fila (el encabezado, si lo hay)
  data: string[]; // todas las filas por debajo del encabezado
}
```

## `ColumnState`

El estado de una tarjeta de columna en la interfaz.

```typescript
interface ColumnState {
  index: number;              // posición en la hoja original — esto es lo que envía `mapping`
  name: string;               // nombre de la columna (o "Columna 1" si el archivo no trae encabezados)
  previewData: string[];      // las primeras `previewRows` filas, las que se muestran
  data: string[];             // todas las filas de esta columna
  assignedKey: string | null; // clave del campo, null = sin asignar, 'ignore' = descartada
}
```

## `MappedResult`

Una entrada de la salida de `@mapped` (cuando no se pasa `transform`).

```typescript
interface MappedResult {
  field: string;      // la SchemaField.key a la que se asignó esta columna
  columnName: string; // el nombre original de la columna en la hoja
  data: string[];     // todos los valores de la columna (sin el encabezado)
}
```

## `MappingOutput`

El payload de `@mapped` cuando `output="mapping"`.

```typescript
interface MappingOutput {
  file: File;                      // el File original, sin transformar
  mapping: Record<number, string>; // índice de columna en la hoja → clave del campo
  hasHeaders: boolean;             // si la fila 1 del archivo es encabezado
}
```

## `RowIssue`

Un problema encontrado en los datos, reportado por un `RowValidator`.

```typescript
interface RowIssue {
  index: number;   // posición en el array de filas que recibiste, base 0
  field?: string;  // clave del campo, para nombrar la columna
  message: string; // se muestra al usuario, ya en su idioma
}
```

## `RowValidator`

```typescript
type RowValidator = (
  rows: Record<string, string>[],
) => RowIssue[] | Promise<RowIssue[]>;
```

Recibe todas las filas de golpe, para que sean posibles las reglas entre filas y
las comprobaciones remotas en lote. Devuelve un array vacío cuando los datos están
bien.

## `SheetMapperError`

```typescript
type SheetMapperErrorCode =
  | "FILE_READ_ERROR"
  | "NO_WORKSHEET"
  | "EMPTY_WORKSHEET"
  | "INVALID_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "TOO_MANY_ROWS"
  | "UNASSIGNED_COLUMNS"
  | "MISSING_REQUIRED_FIELDS"
  | "DUPLICATE_ASSIGNMENTS"
  | "NO_FILE";

interface SheetMapperError {
  code: SheetMapperErrorCode;
  message: string;
  missingFields?: string[];     // solo en MISSING_REQUIRED_FIELDS
  unassignedColumns?: string[]; // solo en UNASSIGNED_COLUMNS
  duplicateFields?: string[];   // solo en DUPLICATE_ASSIGNMENTS
  maxSize?: string;             // solo en FILE_TOO_LARGE
  rowCount?: number;            // solo en TOO_MANY_ROWS
}
```

## `MatcherFn`

```typescript
type MatcherFn = (
  columns: ParsedColumn[],
  fields: SchemaField[],
) => Map<number, string>; // Map<posición en columns, clave del campo>
```

Las claves del `Map` devuelto son **posiciones dentro del array `columns` que
recibe**, no `ParsedColumn.index`. Devuelve `0` para la primera columna que te
entregaron, sea cual sea su posición en la hoja.

## `TransformFn`

```typescript
type TransformFn<T = Record<string, string>> = (
  row: Record<string, string>,
) => T | null; // null excluye esa fila del resultado
```

## `Icons`

```typescript
interface Icons {
  upload?: Component;     // icono de subida en la zona vacía
  file?: Component;       // icono de documento cuando ya hay archivo
  assigned?: Component;   // check del estado asignado
  ignored?: Component;    // círculo tachado del estado ignorado
  unassigned?: Component; // aviso del estado sin asignar
  spinner?: Component;    // spinner mientras se parsea
  confirm?: Component;    // icono dentro del botón de confirmar
}
```
