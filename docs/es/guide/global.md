# Registro global

```typescript
import { createApp } from "vue";
import { VueSheetMapperPlugin } from "@dazzadev/vue-sheet-mapper";
import "@dazzadev/vue-sheet-mapper/style.css";
import App from "./App.vue";

createApp(App).use(VueSheetMapperPlugin).mount("#app");
```

Tras registrar el plugin, `<SheetMapper>` está disponible globalmente sin
importarlo en cada componente.
