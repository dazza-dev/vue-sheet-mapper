# Instalación

```bash
npm install @dazzadev/vue-sheet-mapper xlsx
```

```bash
yarn add @dazzadev/vue-sheet-mapper xlsx
```

```bash
pnpm add @dazzadev/vue-sheet-mapper xlsx
```

> `xlsx` es una peer dependency: tienes que instalarla junto al paquete. Lee
> [Seguridad](#seguridad) antes de elegir versión — la copia publicada en npm no
> es la que quieres.

Importa la hoja de estilos una vez, en el punto de entrada de tu app:

```typescript
import "@dazzadev/vue-sheet-mapper/style.css";
```

## Seguridad

`vue-sheet-mapper` pasa el archivo que sube el usuario directamente a SheetJS, así
que qué build de SheetJS instales es una decisión de seguridad, no una preferencia.

**El paquete `xlsx` de npm está abandonado.** SheetJS dejó de publicar ahí después
de la `0.18.5` (2022) y movió la distribución a su propio registro. Dos avisos de
severidad alta afectan a esa versión — [prototype pollution][ghsa1] y
[ReDoS][ghsa2] — y ambos están corregidos en builds posteriores que nunca se
publicaron en npm. Instalar `xlsx` por la vía normal te da el código vulnerable.

Instala en su lugar el build parcheado desde SheetJS:

```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

```bash
pnpm add https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

Se instala con el mismo nombre `xlsx` y expone la misma API, así que no cambia nada
ni en tu código ni en este paquete. El rango de la peer dependency es `>=0.18.0`
precisamente para que estos builds lo satisfagan.

**Un matiz, para que no te sorprenda luego:** `npm audit` y Dependabot van a seguir
marcando `xlsx` aunque cambies. Los dos avisos están registrados contra el paquete
de npm sin versión corregida, porque desde el punto de vista de npm no existe
ninguna. El build parcheado sí lleva los arreglos; la base de datos de
vulnerabilidades simplemente no tiene a dónde apuntar. Si tu organización no puede
cargar con una dependencia marcada de forma permanente, lo que necesitas es
cambiar de parser, no de versión.

[ghsa1]: https://github.com/advisories/GHSA-4r6h-8v6p-xvw6
[ghsa2]: https://github.com/advisories/GHSA-5pgg-2g8v-p4x9
