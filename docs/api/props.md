# Props & events

## Props

| Prop                | Type                                   | Default | Description                                                                                                  |
| ------------------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `fields`            | `SchemaField[]`                        | —       | **Required.** The target schema your file columns map to.                                                    |
| `locale`            | `'en' \| 'es' \| 'fr' \| 'pt' \| 'nl'` | `'en'`  | UI language.                                                                                                 |
| `messages`          | `MessagesOverride`                     | —       | Override individual strings for the active locale.                                                           |
| `icons`             | `Icons`                                | —       | Replace any default icon with your own component.                                                            |
| `matcher`           | `MatcherFn`                            | —       | Custom auto-match function. Replaces the built-in key/label/alias matcher.                                   |
| `output`            | `'rows' \| 'mapping'`                  | `'rows'`| What `@mapped` emits. `'rows'` sends the mapped column data; `'mapping'` sends `{ file, mapping, hasHeaders }` so your backend does the reading. `transform` is ignored when `'mapping'`. |
| `transform`         | `TransformFn`                          | —       | Convert each data row before `@mapped` fires. Return `null` to exclude a row. Ignored when `output` is `'mapping'`. |
| `previewRows`       | `number`                               | `5`     | How many data rows to show in each column card.                                                              |
| `defaultHasHeaders` | `boolean`                              | `true`  | Whether the first row is treated as a header on load and after reset.                                        |
| `autoIgnore`        | `boolean`                              | `false` | Automatically set unmatched columns to "ignore" after auto-matching.                                         |
| `autoConfirm`       | `boolean`                              | `false` | Emit `@mapped` immediately if all columns are valid after auto-matching, without showing the confirm button. |
| `maxFileSize`       | `number`                               | —       | Maximum file size in bytes. Files larger than this are rejected before parsing.                              |
| `maxRows`           | `number`                               | —       | Maximum number of data rows allowed. Files with more rows are rejected after parsing.                        |
| `validateRows`      | `RowValidator`                         | —       | Checks the mapped rows and reports problems. Runs after the mapping checks pass; blocks `@mapped` when it returns anything. |
| `maxIssuesShown`    | `number`                               | `50`    | How many problems to list at once.                                                                           |
| `encoding`          | `string`                               | —       | `TextDecoder` label (e.g. `'shift-jis'`) forcing the encoding of CSV/text files. Detected automatically when omitted; ignored for `.xlsx` and `.xls`. |

---

## Events

| Event             | Payload                                           | Description                                                                                                                       |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@mapped`         | `MappedResult[] \| MappingOutput \| unknown[]`    | Emitted after successful validation. `MappedResult[]` by default, the output of your `transform` function if provided, or a `MappingOutput` when `output="mapping"`. |
| `@error`          | `SheetMapperError`                                | Emitted when a file or validation error occurs.                                                                                   |
| `@file-picked`    | `File`                                            | Emitted immediately when the user selects a file, before parsing.                                                                 |
| `@columns-loaded` | `{ name: string; assignedKey: string \| null }[]` | Emitted after the file is parsed and columns are shown. Includes the detected column names and their initial auto-match result.   |
| `@invalid`        | `RowIssue[]`                                      | Emitted instead of `@mapped` when `validateRows` reports problems.                                                                |
| `@reset`          | —                                                 | Emitted when the user clicks "change file" and returns to the dropzone.                                                           |

---
