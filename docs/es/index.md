---
layout: home

hero:
  name: "vue-sheet-mapper"
  text: "Importar Excel y CSV en Vue 3"
  tagline: "Tus usuarios suben su hoja de cálculo y te indican qué es cada columna. Tú recibes los datos con la forma que espera tu app."
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
  - title: "Excel y CSV"
    details: "Lee .xlsx, .xls y .csv detectando la codificación del texto, así que UTF-8 sin BOM, UTF-16 y Windows-1252 llegan intactos."
  - title: "Las columnas ya vienen emparejadas"
    details: "El nombre de cada columna se compara con la key, la label y los aliases de cada campo, ignorando acentos, así que el usuario llega con casi todo resuelto."
  - title: "Los campos pueden llegar tarde"
    details: "Pasa un ref, un computed o un getter. La lista de campos puede venir de tu API después de que el usuario eligió el archivo, y el emparejado se pone al día solo."
  - title: "Filas o el archivo tal cual"
    details: "Recibe las filas ya emparejadas en JSON, o el archivo sin tocar más un diccionario de columnas, y que lo lea tu backend."
  - title: "Tus reglas, no las nuestras"
    details: "Un hook te entrega todas las filas. zod, yup, una función tuya o tu backend — la librería no mira los valores, solo devuelve cada problema a su fila."
  - title: "O sin interfaz"
    details: "useSheetMapper lleva todo el flujo sin markup, así que Vuetify, PrimeVue o tus propios componentes pintan la pantalla."
---
