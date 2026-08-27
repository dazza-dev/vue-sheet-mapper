# API exportada

```typescript
import {
  SheetMapper,
  useSheetMapper,
  VueSheetMapperPlugin,
  autoMatch,
  toRows,
  parseFile,
  getMessages,
  IconUpload,
  IconFile,
  IconCheck,
  IconBan,
  IconAlert,
  IconSpinner,
} from "@dazzadev/vue-sheet-mapper";
```

| Export | Tipo | Descripción |
| --- | --- | --- |
| `SheetMapper` | Componente | El componente principal |
| `useSheetMapper` | Composable | La lógica headless |
| `VueSheetMapperPlugin` | Plugin | Para el registro global con `app.use()` |
| `autoMatch` | Función | El algoritmo de auto-match por defecto |
| `toRows` | Función | Convierte `MappedResult[]` en objetos de fila |
| `parseFile` | Función | Parsea un `File` de Excel/CSV en `ParsedColumn[]` |
| `getMessages` | Función | Resuelve las cadenas de un idioma, con overrides opcionales |
| `IconUpload` … `IconSpinner` | Componentes | Los iconos por defecto, por si quieres reutilizarlos al sobrescribir solo algunos |
| `SchemaField` | Tipo | Definición de un campo |
| `UseSheetMapperOptions` | Tipo | Opciones de `useSheetMapper` |
| `UseSheetMapperReturn` | Tipo | Lo que devuelve `useSheetMapper` |
| `MappedResult` | Tipo | Una entrada de la salida por columna |
| `MappingOutput` | Tipo | El payload de `@mapped` con `output="mapping"` |
| `RowValidator` | Tipo | Firma del hook de validación de datos |
| `RowIssue` | Tipo | Un problema reportado por un `RowValidator` |
| `ParsedColumn` | Tipo | Una columna cruda del archivo parseado |
| `ColumnState` | Tipo | El estado de una tarjeta de columna |
| `SheetMapperError` | Tipo | El objeto de error |
| `SheetMapperErrorCode` | Tipo | La unión de códigos de error |
| `Messages` | Tipo | El objeto completo de textos |
| `MessagesOverride` | Tipo | Overrides parciales de textos |
| `Locale` | Tipo | `'en' \| 'es' \| 'fr' \| 'pt' \| 'nl'` |
| `Icons` | Tipo | El mapa de iconos sobrescribibles |
| `MatcherFn` | Tipo | Firma de una función de auto-match |
| `TransformFn` | Tipo | Firma de una función de transformación de fila |
