# CSS theming

All visual properties are exposed as CSS custom properties on the `.vsm` root element. Override them from your app CSS — no SCSS required.

The defaults meet WCAG AA contrast (4.5:1) against a white background. If you
override the colours, keep that in mind — the text colours below are read as
text, not just used as borders.

```css
.vsm {
  --vsm-primary: #2563eb;
  --vsm-primary-hover: #1d4ed8;
  --vsm-success-color: #15803d;
  --vsm-warning-color: #b45309;
  --vsm-danger-color: #dc2626;
  --vsm-text-color: #111827;
  --vsm-muted-color: #6b7280;
  --vsm-border-color: #e5e7eb;
  --vsm-card-bg: #ffffff;
  --vsm-dropzone-bg: #f9fafb;
  --vsm-dropzone-hover-bg: #eff6ff;
  --vsm-input-bg: #ffffff;
  --vsm-link-color: #2563eb;
  --vsm-radius: 8px;
  --vsm-radius-sm: 4px;
}
```

Override by targeting `.vsm` from your app:

```css
/* match your brand color */
.vsm {
  --vsm-primary: #7c3aed;
  --vsm-primary-hover: #6d28d9;
  --vsm-radius: 4px;
}
```

Or scope the override to a specific instance:

```vue
<div class="my-importer">
  <SheetMapper :fields="fields" />
</div>
```

```css
.my-importer .vsm {
  --vsm-primary: #7c3aed;
}
```

---
