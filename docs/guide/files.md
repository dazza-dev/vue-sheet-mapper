# File handling

## File encoding

`.xlsx` and `.xls` carry their own encoding, so they always read correctly. CSV and other text files do not, and the encoding has to be inferred from the bytes.

The rules, in order:

1. A UTF-16 byte order mark wins — both LE and BE.
2. An explicit `encoding` prop wins over detection.
3. Otherwise, the file is decoded as UTF-8 when the bytes are valid UTF-8, and as Windows-1252 when they are not.

That last step matters because the two common CSV producers disagree. Excel for Windows writes Windows-1252, or UTF-8 with a BOM. Almost everything else — Google Sheets, Numbers, `pandas`, a backend export — writes UTF-8 with no BOM. Both are handled without configuration: for Windows-1252 text to pass a strict UTF-8 decode, every high byte would have to land inside a valid multi-byte sequence, which accented text does not do. Pure ASCII decodes the same either way.

Set `encoding` only for a legacy encoding the detection cannot reach, such as Shift-JIS, GB18030 or KOI8-R — those are not valid UTF-8, so they would otherwise fall back to Windows-1252 and come out garbled.

```vue
<SheetMapper :fields="fields" encoding="shift-jis" />
```

```typescript
const { loadFile } = useSheetMapper(fields, { encoding: "shift-jis" });
```

Any [`TextDecoder` label](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings) is accepted.

---

## File size limit

Reject files before parsing with `maxFileSize` (in bytes). The error message is localized and supports the `{size}` placeholder.

```vue
<!-- 5 MB limit -->
<SheetMapper :fields="fields" :max-file-size="5 * 1024 * 1024" />
```

## Row limit

Reject files with too many rows after parsing with `maxRows`. Useful when your backend or import pipeline has a processing limit. The error message is localized and supports the `{max}` placeholder.

```vue
<!-- Reject files with more than 10,000 data rows -->
<SheetMapper :fields="fields" :max-rows="10_000" />
```

> The check happens **after** parsing, so the file size limit (`maxFileSize`) is the right tool to keep large files from being read at all. Use both together for a complete guard.

```vue
<SheetMapper
  :fields="fields"
  :max-file-size="10 * 1024 * 1024"
  :max-rows="10_000"
/>
```

---
