# Automatic behavior

## `autoIgnore`

Columns not matched by auto-match are automatically set to "ignore", so the user only has to deal with the columns that were recognized.

```vue
<SheetMapper :fields="fields" :auto-ignore="true" />
```

## `autoConfirm`

If all columns are valid after auto-match (all assigned or ignored, all required fields covered), `@mapped` fires immediately without showing the confirm button. If validation fails, the mapper shows normally so the user can fix it.

```vue
<SheetMapper :fields="fields" :auto-confirm="true" />
```

## Combining both

The most automated setup — zero user interaction when the file format is known:

```vue
<SheetMapper
  :fields="fields"
  :auto-ignore="true"
  :auto-confirm="true"
  :transform="myTransform"
  @mapped="saveToAPI"
/>
```

---
