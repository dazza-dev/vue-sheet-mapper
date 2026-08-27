# Custom matcher

The built-in auto-matcher normalizes column names (lowercase, no accents, alphanumeric only) and does an exact comparison against each field's `key`, `label` and `aliases`. To replace it entirely, pass a `matcher` function.

> The keys of the `Map` you return are positions in the `columns` array you received, not `ParsedColumn.index`.

```typescript
import type { MatcherFn } from "@dazzadev/vue-sheet-mapper";

// Example 1 — positional: column 0 → first field, column 1 → second field
const positionalMatcher: MatcherFn = (columns, fields) => {
  const map = new Map<number, string>();
  columns.forEach((_, i) => {
    if (fields[i]) map.set(i, fields[i].key);
  });
  return map;
};

// Example 2 — fuzzy: match if column name *contains* a field label
const fuzzyMatcher: MatcherFn = (columns, fields) => {
  const map = new Map<number, string>();
  const used = new Set<string>();
  for (let i = 0; i < columns.length; i++) {
    const norm = columns[i].name.toLowerCase().replace(/\s+/g, "");
    for (const field of fields) {
      if (used.has(field.key)) continue;
      const candidates = [field.label, ...(field.aliases ?? [])];
      if (
        candidates.some((c) =>
          norm.includes(c.toLowerCase().replace(/\s+/g, "")),
        )
      ) {
        map.set(i, field.key);
        used.add(field.key);
        break;
      }
    }
  }
  return map;
};
```

```vue
<SheetMapper :fields="fields" :matcher="positionalMatcher" />
```

Import `autoMatch` if you want to compose with the default:

```typescript
import { autoMatch } from "@dazzadev/vue-sheet-mapper";
```

---
