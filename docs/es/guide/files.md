# Archivos

## Codificación

Los `.xlsx` y `.xls` llevan su propia codificación, así que siempre se leen bien.
Los CSV y demás archivos de texto no, y hay que deducirla de los bytes.

Las reglas, en orden:

1. Un BOM de UTF-16 manda — tanto LE como BE.
2. Una prop `encoding` explícita manda sobre la detección.
3. Si no, el archivo se decodifica como UTF-8 cuando los bytes son UTF-8 válido, y
   como Windows-1252 cuando no lo son.

Ese último paso importa porque los dos generadores habituales de CSV no se ponen
de acuerdo. Excel para Windows escribe Windows-1252, o UTF-8 con BOM. Casi todo
lo demás —Google Sheets, Numbers, `pandas`, un export de tu backend— escribe UTF-8
sin BOM. Los dos casos se resuelven sin configurar nada: para que un texto en
Windows-1252 pase una decodificación estricta de UTF-8, cada byte alto tendría que
caer dentro de una secuencia multibyte válida, cosa que el texto con acentos no
hace. El ASCII puro se decodifica igual por ambos caminos.

Fija `encoding` solo para una codificación antigua a la que la detección no llega,
como Shift-JIS, GB18030 o KOI8-R: esas no son UTF-8 válido, así que caerían al
fallback de Windows-1252 y saldrían con los caracteres rotos.

```vue
<SheetMapper :fields="fields" encoding="shift-jis" />
```

```typescript
const { loadFile } = useSheetMapper(fields, { encoding: "shift-jis" });
```

Se acepta cualquier [etiqueta de `TextDecoder`](https://developer.mozilla.org/es/docs/Web/API/Encoding_API/Encodings).

## Tamaño máximo

Rechaza archivos antes de parsearlos con `maxFileSize`, en bytes. El mensaje de
error está traducido y admite el marcador `{size}`.

```vue
<!-- límite de 5 MB -->
<SheetMapper :fields="fields" :max-file-size="5 * 1024 * 1024" />
```

## Límite de filas

Rechaza archivos con demasiadas filas después de parsear, con `maxRows`. Útil
cuando tu backend o tu pipeline de importación tiene un límite de proceso. El
mensaje está traducido y admite el marcador `{max}`.

```vue
<!-- rechaza archivos con más de 10.000 filas de datos -->
<SheetMapper :fields="fields" :max-rows="10_000" />
```

> La comprobación ocurre **después** de parsear, así que el límite de tamaño
> (`maxFileSize`) es la herramienta adecuada para evitar que un archivo enorme
> llegue siquiera a leerse. Úsalos juntos para una defensa completa.

```vue
<SheetMapper
  :fields="fields"
  :max-file-size="10 * 1024 * 1024"
  :max-rows="10_000"
/>
```
