---
layout: home

hero:
  name: vue-sheet-mapper
  text: Map spreadsheet columns to your schema
  tagline: A Vue 3 component for the part of an import that users actually struggle with — telling you which column is which.
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
    details: Reads .xlsx, .xls and .csv. Encoding is detected, so a UTF-8 file without a byte order mark no longer arrives garbled.
  - title: Auto-matching
    details: Columns are matched against each field's key, label and aliases, ignoring accents. Replace the algorithm entirely when you need to.
  - title: Reactive schemas
    details: Pass a ref, a computed or a getter. A schema fetched from your API can land after the user picked their file, and matching re-runs on its own.
  - title: Two output modes
    details: Take the mapped rows as JSON, or take the raw file plus a column dictionary and let your backend do the reading.
  - title: Bring your own validation
    details: A single hook hands you every mapped row. zod, yup, a plain function or your backend — the library never inspects a value, it only routes problems back to the right row.
  - title: Headless
    details: useSheetMapper carries the whole flow with no markup, so Vuetify, PrimeVue or your own design system stay in charge of the UI.
---
