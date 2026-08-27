# Matcher

El auto-match integrado normaliza el nombre de la columna (minúsculas, sin
acentos, solo alfanuméricos) y lo compara exactamente contra la `key`, la `label`
y los `aliases` de cada campo. Para reemplazarlo entero, pasa una función
`matcher`.

> Las claves del `Map` que devuelves son posiciones dentro del array `columns` que
> recibiste, no `ParsedColumn.index`.

```typescript
import { autoMatch } from "@dazzadev/vue-sheet-mapper";
import type { MatcherFn } from "@dazzadev/vue-sheet-mapper";

// Ejemplo 1 — posicional: columna 0 → primer campo, columna 1 → segundo
const positionalMatcher: MatcherFn = (columns, fields) => {
  const map = new Map<number, string>();
  columns.forEach((_, i) => {
    if (fields[i]) map.set(i, fields[i].key);
  });
  return map;
};

// Ejemplo 2 — difuso: usa includes() en vez de coincidencia exacta
const fuzzyMatcher: MatcherFn = (columns, fields) => {
  const map = new Map<number, string>();
  const usados = new Set<string>();
  for (let i = 0; i < columns.length; i++) {
    const norm = columns[i].name.toLowerCase().replace(/\s+/g, "");
    for (const field of fields) {
      if (usados.has(field.key)) continue;
      const candidatos = [field.label, ...(field.aliases ?? [])];
      if (candidatos.some((c) => norm.includes(c.toLowerCase().replace(/\s+/g, "")))) {
        map.set(i, field.key);
        usados.add(field.key);
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

Importa `autoMatch` desde el paquete si quieres componer con el algoritmo por
defecto en lugar de sustituirlo.

Ojo: si tu matcher asigna el mismo campo a dos columnas, `validate()` lo rechaza
con `DUPLICATE_ASSIGNMENTS` en vez de dejar que una de ellas se pierda en
silencio.
