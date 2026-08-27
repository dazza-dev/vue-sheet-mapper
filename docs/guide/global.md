# Global registration

```typescript
// main.ts
import { createApp } from "vue";
import { VueSheetMapperPlugin } from "@dazzadev/vue-sheet-mapper";
import "@dazzadev/vue-sheet-mapper/style.css";
import App from "./App.vue";

createApp(App).use(VueSheetMapperPlugin).mount("#app");
```

After registering the plugin, `<SheetMapper>` is available globally without importing it in each component.

---
