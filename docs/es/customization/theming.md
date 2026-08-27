# Temas CSS

Todas las propiedades visuales se exponen como CSS custom properties en el elemento raíz `.vsm`. Sobrescríbelas desde el CSS de tu app; no hace falta SCSS.

Los valores por defecto cumplen el contraste WCAG AA (4.5:1) sobre fondo blanco.
Tenlo en cuenta si los cambias: los colores de abajo se leen como texto, no solo
se usan como bordes.

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

Sobrescribe apuntando a `.vsm` desde tu app:

```css
/* tu color de marca */
.vsm {
  --vsm-primary: #7c3aed;
  --vsm-primary-hover: #6d28d9;
  --vsm-radius: 4px;
}
```

O acota el override a una instancia concreta:

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
