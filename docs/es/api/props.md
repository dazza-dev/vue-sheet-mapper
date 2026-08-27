# Props y eventos

## Props

| Prop | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `fields` | `SchemaField[]` | — | **Obligatoria.** Los campos del esquema a los que se pueden asignar columnas. |
| `locale` | `'en' \| 'es' \| 'fr' \| 'pt' \| 'nl'` | `'en'` | Idioma de la interfaz. |
| `messages` | `MessagesOverride` | — | Sobrescribe cadenas sueltas del idioma activo. |
| `icons` | `Icons` | — | Reemplaza cualquier icono por un componente tuyo. |
| `matcher` | `MatcherFn` | — | Función de auto-match propia. Reemplaza la integrada. |
| `validateRows` | `RowValidator` | — | Comprueba las filas mapeadas y reporta problemas. Corre después de las comprobaciones de mapeo y bloquea `@mapped` si devuelve algo. |
| `maxIssuesShown` | `number` | `50` | Cuántos problemas se listan a la vez. |
| `output` | `'rows' \| 'mapping'` | `'rows'` | Qué emite `@mapped`. `'mapping'` envía `{ file, mapping, hasHeaders }` para que la lectura la haga tu backend. Ignora `transform`. |
| `transform` | `TransformFn` | — | Convierte cada fila antes de emitir `@mapped`. Devuelve `null` para excluirla. |
| `previewRows` | `number` | `5` | Cuántas filas de datos se muestran en cada tarjeta. |
| `defaultHasHeaders` | `boolean` | `true` | Si la primera fila se trata como encabezado al cargar y tras reiniciar. |
| `autoIgnore` | `boolean` | `false` | Pone en «ignorar» las columnas sin coincidencia tras el auto-match. |
| `autoConfirm` | `boolean` | `false` | Emite `@mapped` de inmediato si todo es válido tras el auto-match, sin mostrar el botón de confirmar. |
| `maxFileSize` | `number` | — | Tamaño máximo en bytes. Los archivos mayores se rechazan antes de parsear. |
| `maxRows` | `number` | — | Máximo de filas de datos. Los archivos con más se rechazan tras parsear. |
| `encoding` | `string` | — | Etiqueta de `TextDecoder` (por ejemplo `'shift-jis'`) que fuerza la codificación de archivos de texto. Se detecta sola si se omite; se ignora en `.xlsx` y `.xls`. |

## Eventos

| Evento | Payload | Descripción |
| --- | --- | --- |
| `@mapped` | `MappedResult[] \| MappingOutput \| unknown[]` | Se emite tras una validación correcta. `MappedResult[]` por defecto, la salida de tu `transform` si lo pasaste, o un `MappingOutput` con `output="mapping"`. |
| `@invalid` | `RowIssue[]` | Se emite **en lugar de** `@mapped` cuando `validateRows` reporta problemas. |
| `@error` | `SheetMapperError` | Se emite cuando falla el archivo o la validación del mapeo. |
| `@file-picked` | `File` | Se emite en cuanto el usuario elige un archivo, antes de parsearlo. |
| `@columns-loaded` | `{ name: string; assignedKey: string \| null }[]` | Se emite tras parsear, con los nombres detectados y su auto-match inicial. |
| `@reset` | — | Se emite al volver al estado inicial. |
