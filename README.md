<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/dazza-dev/vue-sheet-mapper/main/demo/public/logo-wordmark-dark.svg">
    <img src="https://raw.githubusercontent.com/dazza-dev/vue-sheet-mapper/main/demo/public/logo-wordmark.svg" alt="vue-sheet-mapper" width="340">
  </picture>
</p>

<p align="center">
  Your users upload a spreadsheet and say which column is which.<br>
  You get the data in the shape your app expects.<br><br>
  Give it your field list and it handles the upload, the column preview,<br>
  the auto-matching, the validation and the output.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper"><img src="https://img.shields.io/npm/v/@dazzadev/vue-sheet-mapper?color=42b883&label=npm" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper"><img src="https://img.shields.io/bundlephobia/minzip/@dazzadev/vue-sheet-mapper?color=35495e&label=gzip" alt="bundle size"></a>
  <img src="https://img.shields.io/npm/l/@dazzadev/vue-sheet-mapper?color=35495e" alt="license">
</p>

<p align="center">
  <strong><a href="https://dazza-dev.github.io/vue-sheet-mapper/">Live demo →</a></strong>
  &nbsp;·&nbsp;
  <a href="CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/dazza-dev/vue-sheet-mapper/main/demo/public/screenshot.png" alt="Column mapping screen: each spreadsheet column is a card with a data preview — matched columns in green, an ignored column in orange, and an unmatched one waiting for the user to pick a field" width="900">
</p>

## Features

- **Excel & CSV** — reads `.xlsx`, `.xls` and `.csv`, detecting the text encoding
- **Auto-match** — maps columns to fields by key, label or aliases, accent-insensitive
- **Reactive schemas** — pass a `ref`, `computed` or getter; fields may arrive from your API after the file is picked
- **Two output modes** — the mapped rows, or the raw file plus a mapping dictionary for server-side imports
- **Bring your own validation** — one hook hands you every row; zod, yup, your own function or your backend
- **i18n** — 5 built-in locales (en, es, fr, pt, nl) with per-key overrides
- **Themeable** — every visual property is a CSS custom property; icons and strings are replaceable
- **Headless** — `useSheetMapper` carries the whole flow with no markup
- **TypeScript** — full type declarations included

## Installation

```bash
npm install @dazzadev/vue-sheet-mapper xlsx
```

> `xlsx` is a peer dependency. **Read [Security](https://dazza-dev.github.io/vue-sheet-mapper/docs/guide/installation#security) before choosing a version** — the copy published on npm is stale and carries unfixed advisories.

## Quick start

```vue
<script setup lang="ts">
import { SheetMapper } from "@dazzadev/vue-sheet-mapper";
import "@dazzadev/vue-sheet-mapper/style.css";
import type { MappedResult, SchemaField } from "@dazzadev/vue-sheet-mapper";

const fields: SchemaField[] = [
  { key: "name", label: "Name", requireColumn: true },
  { key: "email", label: "Email", requireColumn: true },
];

function onMapped(results: MappedResult[]) {
  // one entry per assigned column
}
</script>

<template>
  <SheetMapper
    :fields="fields"
    @mapped="(results) => onMapped(results as MappedResult[])"
  />
</template>
```

## Documentation

Everything else lives in the docs:

| | |
| --- | --- |
| [Guide](https://dazza-dev.github.io/vue-sheet-mapper/docs/guide/installation) | Installation, security, validation, output modes, file handling, headless usage |
| [Customization](https://dazza-dev.github.io/vue-sheet-mapper/docs/customization/i18n) | i18n, icons, matcher, transform, slots, CSS theming |
| [API](https://dazza-dev.github.io/vue-sheet-mapper/docs/api/props) | Props, events, TypeScript types, exports |
| [Changelog](CHANGELOG.md) | Every release, with migration notes |

## Contributing

```bash
pnpm install
pnpm dev          # the demo, with hot reload
pnpm docs:dev     # the documentation site
pnpm test         # the suite
pnpm build        # typecheck + library build
```

## License

MIT
