# Validación

`validate()` corre antes de que se emita `@mapped` y comprueba tres cosas:

- que cada columna esté asignada a un campo o marcada como ignorada,
- que cada campo marcado con `requireColumn: true` tenga una columna asignada,
- que ningún campo esté asignado a más de una columna.

## Por qué `requireColumn` y no `required`

`requireColumn: true` comprueba el **mapeo**, no los **datos**. Pregunta "¿el
usuario apuntó alguna columna a este campo?", no "¿cada fila trae un valor?".

Un archivo cuya columna `Correo` existe pero está en blanco en las filas 4 y 7
pasa esta comprobación, y esas dos filas llegan a `@mapped` con `email: ""`. Lo
mismo con una dirección malformada, una fecha que no existe o un `"N/A"` en una
columna numérica.

Todas las librerías de esquemas —zod, yup, JSON Schema— llaman `required` a la
pregunta de nivel fila, así que llamar `required` a esta prometía una
comprobación que la librería no hace. El nombre queda libre para una futura
validación por fila, y el flag dice lo que hace.

Para comprobar los valores en sí, usa [`validateRows`](#validar-los-datos).

## Validar los datos

`validate()` comprueba el mapeo. Para comprobar los valores, pasa `validateRows`.

La librería nunca inspecciona un valor, y nunca lo hará: las reglas son tuyas.
Trae [zod](https://zod.dev), yup, una función normal o tu propio backend — la
librería solo devuelve cada problema que reportes a la fila que le corresponde.

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

Las filas llegan todas de golpe, en vez de una llamada por fila, porque es lo que
necesitan las reglas entre filas y las comprobaciones remotas:

```typescript
// Un duplicado es invisible desde dentro de una sola fila
const validateRows: RowValidator = (rows) => {
  const vistos = new Set<string>();
  return rows.flatMap((row, index) =>
    vistos.has(row.id) ? [{ index, field: "id", message: "Duplicado" }] : (vistos.add(row.id), []),
  );
};

// Una petición, no una por fila
const validateRows: RowValidator = (rows) =>
  fetch("/api/import/check", { method: "POST", body: JSON.stringify(rows) }).then((r) => r.json());
```

Devuelve un array vacío cuando los datos están bien y `@mapped` se emite con
normalidad. Devuelve cualquier cosa y el componente lista los problemas, emite
`@invalid` en su lugar, y deja al usuario corregir el archivo y reintentar.

### `RowIssue`

```typescript
interface RowIssue {
  index: number;   // posición en el array de filas que recibiste, base 0
  field?: string;  // clave del campo, para nombrar la columna
  message: string; // se muestra al usuario, ya en su idioma
}
```

Reporta `index`, la posición dentro del array que te entregaron. El componente lo
traduce al número de fila que el usuario ve en su hoja de cálculo, que depende de
si la fila 1 es encabezado, y muestra *"Fila 22"*. Esa traducción es justo la
parte que no puedes reconstruir fácilmente fuera del componente.

### Qué se valida en modo `output="mapping"`

El validador siempre recibe los valores **tal y como los leyó el navegador**. En
modo `output="rows"` eso es exactamente lo que emite `@mapped`, así que las dos
lecturas nunca discrepan. En modo `output="mapping"` tu backend vuelve a leer el
archivo, y una celda guarda un valor y un formato de visualización por separado,
así que las dos lecturas pueden diferir:

| Celda | Tu validador ve | Tu backend lee |
| --- | --- | --- |
| una fecha | `"17/04/1991"` | `33345` |
| un número con formato `#,##0` | `"1,500"` | `1500` |
| un porcentaje | `"7.5%"` | `0.075` |

Una regla como `/^\d{4}-\d{2}-\d{2}$/` sobre una columna de fechas pasa en cuanto
el usuario cambia el *formato* de la celda, mientras que el valor almacenado —el
que importa tu backend— no se movió. Y al revés también muerde:
`Number(row.expected)` rechaza `"1,500"` aunque el backend habría recibido un
`1500` perfectamente válido.

Las columnas de texto —nombres, correos, cédulas— se leen igual por ambos lados y
no tienen riesgo. Así que en modo `mapping`, valida aquí presencia y forma de
texto, y deja fechas y números al backend, que es el lado que lee el valor real.

### Esto no sustituye la validación en el servidor

Cualquier cosa que corra en el navegador se puede saltar llamando a tu API
directamente, así que sigue validando en el servidor. Lo que esto te compra es
*cuándo* se entera el usuario: con el archivo todavía abierto delante, en vez de
en un informe de errores una hora después.
