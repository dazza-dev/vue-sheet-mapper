# Custom icons

Pass any Vue component — from your icon library or your own SVGs. You only need to provide the icons you want to change; the rest use the defaults.

```vue
<script setup lang="ts">
import { PhUpload, PhFile, PhCheckCircle } from "@phosphor-icons/vue";
import type { Icons } from "@dazzadev/vue-sheet-mapper";

const icons: Icons = {
  upload: PhUpload,
  file: PhFile,
  confirm: PhCheckCircle,
};
</script>

<template>
  <SheetMapper :fields="fields" :icons="icons" />
</template>
```

The default icon components are also exported if you want to reference them:

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

---
