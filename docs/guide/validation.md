# Validation

`validate()` runs before `@mapped` fires and checks three things:

- every column is assigned to a field or marked as ignored,
- every field marked `requireColumn: true` has a column mapped to it,
- no field is mapped to more than one column.

## What `requireColumn` checks

`requireColumn: true` is a check on the **mapping**, not on the **data**. It asks
whether the user pointed some column at this field — not whether every row
carries a value.

A file whose `Email` column exists but is blank on rows 4 and 7 passes this
check, and those two rows reach `@mapped` with `email: ""`. The same goes for a
malformed address, a date that does not exist, or `"N/A"` in a numeric column.

To check the values themselves, use [`validateRows`](#validating-the-data).

## Validating the data

`validate()` checks the mapping. To check the values, pass `validateRows`.

The library does not inspect values: the rules are yours.
Bring [zod](https://zod.dev), yup, a plain function or your own backend — the
library only routes what you report back to the right row.

```typescript
import type { RowValidator } from "@dazzadev/vue-sheet-mapper";

const validateRows: RowValidator = (rows) =>
  rows.flatMap((row, index) => {
    const result = schema.safeParse(row);
    return result.success
      ? []
      : result.error.issues.map((issue) => ({
          index,
          field: String(issue.path[0]),
          message: issue.message,
        }));
  });
```

```vue
<SheetMapper :fields="fields" :validate-rows="validateRows" @invalid="onInvalid" />
```

Every row arrives at once, rather than one call per row, because that is what
cross-row rules and remote checks need:

```typescript
// A duplicate is invisible from inside a single row
const validateRows: RowValidator = (rows) => {
  const seen = new Set<string>();
  return rows.flatMap((row, index) =>
    seen.has(row.id) ? [{ index, field: "id", message: "Duplicate" }] : (seen.add(row.id), []),
  );
};

// One request, not one per row
const validateRows: RowValidator = (rows) =>
  fetch("/api/import/check", { method: "POST", body: JSON.stringify(rows) }).then((r) => r.json());
```

Return an empty array when the data is fine and `@mapped` fires as usual.
Return anything and the component lists the problems, fires `@invalid` instead,
and lets the user fix the file and try again.

#### `RowIssue`

```typescript
interface RowIssue {
  index: number; // position in the rows array you received, 0-based
  field?: string; // schema field key, used to name the column
  message: string; // shown to the user, already in their language
}
```

Report `index` — the position in the array you were handed. The component
resolves it to the row number the user sees in their spreadsheet, which depends
on whether row 1 is a header, and shows *"Row 22"*. That translation is the part
you cannot easily rebuild outside the component.

#### What gets validated in `output="mapping"` mode

The validator always receives the values **as the browser read them**. In
`output="rows"` mode that is also exactly what `@mapped` emits, so the two never
disagree. In `output="mapping"` mode your backend re-reads the file, and a
spreadsheet cell stores a value and a display format separately — so the two
readings can differ:

| Cell | Your validator sees | Your backend reads |
| --- | --- | --- |
| a date | `"17/04/1991"` | `33345` |
| a number formatted `#,##0` | `"1,500"` | `1500` |
| a percentage | `"7.5%"` | `0.075` |

A rule like `/^\d{4}-\d{2}-\d{2}$/` on a date column passes once the user
changes the *format* of the cell, while the stored value — the one your backend
imports — never moved. The reverse bites too: `Number(row.expected)` rejects
`"1,500"` even though the backend would have received a perfectly good `1500`.

Text columns — names, emails, ids — read the same both ways and carry no risk.
So in `mapping` mode, validate presence and text shape here, and leave dates and
numbers to the backend, which is the side reading the real value.

#### This is not a replacement for server-side validation

Anything running in the browser can be bypassed by calling your API directly, so
keep validating on the server. What this buys you is *when* the user finds out:
with the file still open in front of them, instead of in an error report an hour
later.

---
