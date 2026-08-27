# Installation

```bash
npm install @dazzadev/vue-sheet-mapper xlsx
```

```bash
yarn add @dazzadev/vue-sheet-mapper xlsx
```

```bash
pnpm add @dazzadev/vue-sheet-mapper xlsx
```

> `xlsx` is a peer dependency — you must install it alongside the package. Read
> [Security](#security) before you pick a version: the copy on npm is not the one
> you want.

Import the stylesheet once in your app entry:

```typescript
import "@dazzadev/vue-sheet-mapper/style.css";
```

---

## Security

`vue-sheet-mapper` feeds the file a user uploads straight into SheetJS, so which
build of SheetJS you install is a security decision, not a preference.

**The `xlsx` package on npm is stale.** SheetJS stopped publishing there after
`0.18.5` (2022) and moved distribution to their own registry. Two high-severity
advisories affect that release — [prototype pollution][ghsa1] and
[ReDoS][ghsa2] — and both are fixed in later builds that were never published to
npm. Installing `xlsx` the ordinary way therefore gets you the vulnerable code.

Install the patched build from SheetJS instead:

```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

```bash
pnpm add https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

It installs under the same `xlsx` name and exposes the same API, so nothing in
your code or in this package changes. The peer range is `>=0.18.0` precisely so
these builds satisfy it.

**One caveat, so it does not surprise you later:** `npm audit` and Dependabot
will keep flagging `xlsx` even after you switch. Both advisories are recorded
against the npm package with no fixed version — because, from npm's point of
view, no fixed version exists. The patched build really does contain the fixes;
the advisory database simply has nowhere to point. If your organization cannot
carry a permanently flagged dependency, you will want to swap the parser
entirely rather than upgrade it.

[ghsa1]: https://github.com/advisories/GHSA-4r6h-8v6p-xvw6
[ghsa2]: https://github.com/advisories/GHSA-5pgg-2g8v-p4x9

---
