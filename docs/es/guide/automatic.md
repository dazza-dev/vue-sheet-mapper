# Comportamiento automático

## `autoIgnore`

Las columnas que el auto-match no reconoce quedan puestas en «ignorar», así el
usuario solo tiene que ocuparse de las que sí se reconocieron.

```vue
<SheetMapper :fields="fields" :auto-ignore="true" />
```

## `autoConfirm`

Si tras el auto-match todo es válido (todas las columnas asignadas o ignoradas,
todos los campos obligatorios cubiertos), `@mapped` se emite de inmediato sin
mostrar el botón de confirmar. Si la validación falla, el mapeador se muestra con
normalidad para que el usuario lo corrija.

```vue
<SheetMapper :fields="fields" :auto-confirm="true" />
```

## Combinando los dos

El montaje más automático posible — cero interacción del usuario cuando el
formato del archivo es conocido:

```vue
<SheetMapper
  :fields="fields"
  :auto-ignore="true"
  :auto-confirm="true"
  :transform="miTransform"
  @mapped="guardarEnLaAPI"
/>
```
