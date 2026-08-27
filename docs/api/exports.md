# Exported API

| Export                 | Kind       | Description                                     |
| ---------------------- | ---------- | ----------------------------------------------- |
| `SheetMapper`          | Component  | Main component                                  |
| `useSheetMapper`       | Composable | Headless logic                                  |
| `VueSheetMapperPlugin` | Plugin     | For `app.use()` global registration             |
| `autoMatch`            | Function   | Default auto-match algorithm                    |
| `toRows`               | Function   | Convert `MappedResult[]` to row objects         |
| `parseFile`            | Function   | Parse an Excel/CSV `File` into `ParsedColumn[]` |
| `getMessages`          | Function   | Resolve locale strings with optional overrides  |
| `IconUpload`           | Component  | Default upload icon                             |
| `IconFile`             | Component  | Default file icon                               |
| `IconCheck`            | Component  | Default check/confirm icon                      |
| `IconBan`              | Component  | Default ignore icon                             |
| `IconAlert`            | Component  | Default unassigned icon                         |
| `IconSpinner`          | Component  | Default spinner icon                            |
| `SchemaField`          | Type       | Field definition                                |
| `UseSheetMapperOptions`| Type       | Options for `useSheetMapper`                    |
| `UseSheetMapperReturn` | Type       | Return object from `useSheetMapper`             |
| `MappedResult`         | Type       | Output entry per mapped column                  |
| `MappingOutput`        | Type       | `@mapped` payload when `output="mapping"`       |
| `ParsedColumn`         | Type       | Raw column from the parsed file                 |
| `ColumnState`          | Type       | UI state per column card                        |
| `SheetMapperError`     | Type       | Error object                                    |
| `SheetMapperErrorCode` | Type       | Error code union                                |
| `Messages`             | Type       | Full i18n messages object                       |
| `MessagesOverride`     | Type       | Deep-partial i18n overrides                     |
| `Locale`               | Type       | `'en' \| 'es' \| 'fr' \| 'pt' \| 'nl'`          |
| `Icons`                | Type       | Icon override map                               |
| `MatcherFn`            | Type       | Custom matcher function signature               |
| `RowValidator`         | Type       | Data validation hook signature                  |
| `RowIssue`             | Type       | One problem reported by a `RowValidator`        |
| `TransformFn`          | Type       | Row transform function signature                |

---
