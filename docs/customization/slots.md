# Slots

## `#error`

Replaces the default error banner. Receives `{ error, dismiss }`.

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

Replaces the default confirm button. Receives `{ validate, loading }`.

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

Replaces the header area of each column card. Receives `{ column, field, clear }`.

```vue
<SheetMapper :fields="fields">
  <template #column-header="{ column, field, clear }">
    <span>{{ field?.label ?? 'Unassigned' }}</span>
    <button v-if="field" @click="clear">✕</button>
  </template>
</SheetMapper>
```

## `#column-select`

Replaces the field selector dropdown in each column card. Receives `{ column, fields, onAssign, onIgnore }`.

> `fields` contains all schema fields, unfiltered. If you want to hide already-assigned fields, track assignments via `@columns-loaded` or `useSheetMapper`.

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

## Default slot (dropzone)

Replaces the entire dropzone UI. Receives `{ open, isDragging, file }`.

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
