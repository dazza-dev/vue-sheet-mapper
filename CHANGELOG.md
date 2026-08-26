# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] — 2026-08-26

No code changes — the published package is identical to 2.0.0.

### Fixed

- **The README images were broken on npm.** They used paths relative to the
  repository, which npmjs.com cannot resolve because it does not serve repo
  files. They are absolute URLs now.
- **`package.json` was missing `repository`, `homepage`, `bugs` and `author`**,
  so the npm page had no link back to the source, the demo or the issue
  tracker — and npm had no repository to resolve relative links against in the
  first place.

## [2.0.0] — 2026-08-26

A major release: the schema can now be reactive, the component can hand you the
raw file plus a mapping dictionary instead of parsed rows, and CSV encoding is
detected instead of assumed. Several of the fixes change what a given file
produces, which is why this is a major and not a minor.

### Breaking changes

- **`ParsedColumn` and `ColumnState` gained a required `index` field** — the
  0-based position of the column in the source spreadsheet. Any code that
  constructs these objects by hand (custom matchers, tests, fixtures) must add
  it. See _Two kinds of column index_ in the README for why the array position
  and the spreadsheet position are not the same number.
- **`useSheetMapper` takes `MaybeRefOrGetter<SchemaField[]>`** instead of a
  plain `SchemaField[]`. Existing calls that pass an array keep working; the
  declared type is what changed.
- **`autoMatch` now also compares against `field.key`**, in addition to `label`
  and `aliases`. A column whose header matches a field key is auto-assigned
  where it previously was not, so initial assignments can differ from 1.x.
- **CSV and text files are decoded by detection, not by assumption.** UTF-8
  without a byte order mark used to be read as Windows-1252, which garbled
  accented characters. It now decodes correctly. A file that produced
  `GarcÃ­a` in 1.x produces `García` in 2.0.0 — correct, but different.
- **`<SheetMapper>` no longer resets when `fields` changes.** It used to discard
  the loaded file and every assignment; it now reconciles the mapping in place.
  If you relied on the reset, call the composable's `reset()` yourself.
- **`hasFile` is typed as `ComputedRef<boolean>`** rather than `Ref<boolean>`.
  The previous type was simply wrong — the value was never writable.

### Added

- **Reactive schemas.** `fields` accepts a `ref`, a `computed` or a getter, so a
  schema fetched from your API can arrive after the user has already picked
  their file. Auto-matching re-runs on its own when it lands, and never
  overwrites a column the user assigned, ignored or cleared by hand.
- **`output` prop (`'rows' | 'mapping'`).** With `output="mapping"`, `@mapped`
  emits `{ file, mapping, hasHeaders }`: the untouched `File` and a
  spreadsheet-column-index to field-key dictionary, for backends that read the
  file themselves. Nothing is materialized into row objects, which matters at
  thousands of rows. The library issues no request and builds no `FormData` —
  the payload is three primitives, so any backend works.
- **`MappingOutput` type**, exported.
- **`encoding` prop and composable option.** A `TextDecoder` label
  (e.g. `'shift-jis'`) that overrides encoding detection for text files. Only
  needed for legacy encodings that detection cannot reach; ignored for `.xlsx`
  and `.xls`.
- **Headless helpers** on `useSheetMapper`: `takenKeys`, `unassignedColumns`,
  `missingRequiredFields`, `isValid`, `mapping`, and `ignoreUnassignedColumns()`.
- **`UseSheetMapperOptions` and `UseSheetMapperReturn`** are now exported types.

### Fixed

- **Empty columns silently shifted every following column.** A column whose data
  cells were all blank was dropped without recording its position, so index 1 in
  the emitted mapping could point at column 2 of the actual file — a silently
  corrupted import. Positions are now preserved.
- **Auto re-matching could assign one field to two columns**, which `validate()`
  did not catch and `toRows()` collapsed, dropping a column's data.
- **Clearing a column could undo itself.** With `:fields` passed as an inline
  array literal, any re-render of the parent re-assigned the column the user had
  just cleared.
- **`defaultHasHeaders` never applied its default.** Vue casts an absent boolean
  prop to `false`, so the mapper started in "no headers" mode while the file had
  been parsed with headers.
- **The `File` was wrapped in a reactive proxy**, so consumers received a `Proxy`
  rather than the `File` itself — a problem the moment you put it in a
  `FormData`. It is held in a `shallowRef` now.
- **`Math.max(...rows)` threw `RangeError` on large files.** Replaced with a
  reduce in `parseFile` and `toRows`.
- **An unparseable file threw a raw `TypeError`** that escaped as a malformed
  error object with no `code`. It is now reported as `FILE_READ_ERROR`.
- **UTF-16 files failed to parse at all.** Both LE and BE are read now.
- The accent-stripping regex held literal combining characters, which any tool
  that normalizes the file could destroy. It uses the escaped `[\u0300-\u036f]` now.

### Migrating from 1.x

Most projects need no changes. Check these three:

1. If you build `ParsedColumn` or `ColumnState` objects yourself — a custom
   matcher's fixtures, or tests — add `index`. TypeScript will point at every
   site.
2. If you send column indexes to a backend, they are now the real spreadsheet
   positions. If you were compensating for the old off-by-N behaviour, remove
   that workaround.
3. If your users upload CSVs and you had told them to save as
   "UTF-8 with BOM" or "Windows-1252", that advice is obsolete.

## [1.0.0] — 2026-06-14

Initial release.

---

The 2.0.0 reactive-schema and headless-helper work started as a contribution from
[@partprogramming09](https://github.com/partprogramming09) in
[#1](https://github.com/dazza-dev/vue-sheet-mapper/pull/1).

[2.0.1]: https://github.com/dazza-dev/vue-sheet-mapper/releases/tag/v2.0.1
[2.0.0]: https://github.com/dazza-dev/vue-sheet-mapper/releases/tag/v2.0.0
[1.0.0]: https://github.com/dazza-dev/vue-sheet-mapper/releases/tag/v1.0.0
