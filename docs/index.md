---
layout: home

hero:
  name: vue-sheet-mapper
  text: Excel and CSV imports for Vue 3
  tagline: Your users upload a spreadsheet and say which column is which. You get the data in the shape your app expects.
  image:
    src: /logo.svg
    alt: vue-sheet-mapper
  actions:
    - theme: brand
      text: Get started
      link: /guide/installation
    - theme: alt
      text: Live demo
      link: https://dazza-dev.github.io/vue-sheet-mapper/
    - theme: alt
      text: GitHub
      link: https://github.com/dazza-dev/vue-sheet-mapper

features:
  - title: Excel & CSV
    details: Reads .xlsx, .xls and .csv. The text encoding is detected, so UTF-8 without a byte order mark, UTF-16 and Windows-1252 all arrive intact.
  - title: Columns matched for them
    details: Column names are compared against each field's key, label and aliases, ignoring accents, so most of the mapping is already done when the user arrives.
  - title: Fields can arrive late
    details: Pass a ref, a computed or a getter. A field list fetched from your API can land after the user picked their file, and the matching catches up on its own.
  - title: Rows or the raw file
    details: Take the mapped rows as JSON, or take the file untouched plus a column dictionary and let your backend read it.
  - title: Your rules, not ours
    details: One hook hands you every row. zod, yup, a function of your own or your backend — the library does not inspect values, it puts each problem back on its row.
  - title: Or no interface at all
    details: useSheetMapper carries the whole flow without markup, so Vuetify, PrimeVue or your own components draw the screen.
---
