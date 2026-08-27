---
layout: home

hero:
  name: "vue-sheet-mapper"
  text: "Mapea columnas de una hoja a tu esquema"
  tagline: "Un componente Vue 3 para la parte de una importación con la que los usuarios de verdad se atascan: decirte qué columna es cuál."
  image:
    src: /logo.svg
    alt: "vue-sheet-mapper"
  actions:
    - theme: brand
      text: "Empezar"
      link: /es/guide/installation
    - theme: alt
      text: "Ver el demo"
      link: https://dazza-dev.github.io/vue-sheet-mapper/
    - theme: alt
      text: "GitHub"
      link: https://github.com/dazza-dev/vue-sheet-mapper

features:
  - title: Excel y CSV
    details: "Lee .xlsx, .xls y .csv detectando la codificación del texto, así que UTF-8 sin BOM, UTF-16 y Windows-1252 llegan intactos."
  - title: Auto-match
    details: "Compara el nombre de cada columna contra la clave, la etiqueta y los alias de cada campo, ignorando acentos. Puedes reemplazar el algoritmo entero."
  - title: Esquemas reactivos
    details: "Pasa un ref, un computed o un getter. Un esquema que viene de tu API puede llegar después de que el usuario eligió su archivo, y el auto-match se reaplica solo."
  - title: Dos modos de salida
    details: "Recibe las filas ya mapeadas como JSON, o el archivo crudo más un diccionario de columnas y que la lectura la haga tu backend."
  - title: Tu propia validación
    details: "Un único hook te entrega todas las filas. zod, yup, una función tuya o tu backend — la librería nunca mira un valor, solo devuelve cada problema a su fila."
  - title: Headless
    details: "useSheetMapper lleva todo el flujo sin markup, así que Vuetify, PrimeVue o tu propio design system siguen mandando en la interfaz."
---
