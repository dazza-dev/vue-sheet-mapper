# Iconos

Cualquier icono se puede reemplazar por un componente Vue tuyo. El override es
parcial: solo se sustituyen las claves que envías, el resto conserva el icono por
defecto.

```vue
<script setup lang="ts">
import type { Icons } from "@dazzadev/vue-sheet-mapper";
import MiIconoSubida from "./MiIconoSubida.vue";
import MiIconoCheck from "./MiIconoCheck.vue";

const customIcons: Icons = {
  upload: MiIconoSubida,
  assigned: MiIconoCheck,
};
</script>

<template>
  <SheetMapper :fields="fields" :icons="customIcons" />
</template>
```

Tu componente recibe `width` y `height` como props, así que lo más simple es un
SVG que las acepte:

```vue
<script setup lang="ts">
defineProps<{ width?: number | string; height?: number | string }>();
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="currentColor">
    <path d="..." />
  </svg>
</template>
```

Los iconos por defecto también se exportan, por si quieres reutilizar alguno
mientras sobrescribes los demás:

```typescript
import {
  IconUpload,
  IconFile,
  IconCheck,
  IconBan,
  IconAlert,
  IconSpinner,
} from "@dazzadev/vue-sheet-mapper";
```

Las claves disponibles están en [`Icons`](/es/api/types#icons).
