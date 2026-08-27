# Slots

## `#error`

Reemplaza el banner de error por defecto. Recibe `{ error, dismiss }`.

```vue
<SheetMapper :fields="fields">
  <template #error="{ error, dismiss }">
    <div class="my-error">
      {{ error.code }}: {{ error.message }}
      <button @click="dismiss">Dismiss</button>
    </div>
  </template>
</SheetMapper>
```

## `#confirm`

Reemplaza el botón de confirmar por defecto. Recibe `{ validate, loading }`.

```vue
<SheetMapper :fields="fields">
  <template #confirm="{ validate, loading }">
    <button :disabled="loading" @click="validate">
      Import now →
    </button>
  </template>
</SheetMapper>
```

## `#column-header`

Reemplaza la cabecera de cada tarjeta de columna. Recibe `{ column, field, clear }`.

```vue
<SheetMapper :fields="fields">
  <template #column-header="{ column, field, clear }">
    <span>{{ field?.label ?? 'Unassigned' }}</span>
    <button v-if="field" @click="clear">✕</button>
  </template>
</SheetMapper>
```

## `#column-select`

Reemplaza el desplegable de selección de campo de cada tarjeta. Recibe `{ column, fields, onAssign, onIgnore }`.

> `fields` contiene todos los campos del esquema, sin filtrar. Si quieres ocultar los ya asignados, lleva tú la cuenta de las asignaciones o usa `takenKeys` desde el composable.

```vue
<SheetMapper :fields="fields">
  <template #column-select="{ fields, onAssign, onIgnore }">
    <select @change="(e) => onAssign((e.target as HTMLSelectElement).value)">
      <option value="">-- select --</option>
      <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
    </select>
    <button @click="onIgnore">Skip</button>
  </template>
</SheetMapper>
```

## Slot por defecto (zona de subida)

Reemplaza toda la interfaz de la zona de subida. Recibe `{ open, isDragging, file }`.

```vue
<SheetMapper :fields="fields">
  <template #default="{ open, isDragging, file }">
    <div :class="{ dragging: isDragging }" @click="open">
      <span v-if="file">{{ file.name }}</span>
      <span v-else>Drop your file here</span>
    </div>
  </template>
</SheetMapper>
```

---
