import { defineConfig } from 'vitepress';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { version } = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'));

const REPO = 'https://github.com/dazza-dev/vue-sheet-mapper';

/** The demo already owns the Pages root and is linked from npm, so the docs
 *  live one level down rather than taking the published URL away from it. */
export default defineConfig({
    title: 'vue-sheet-mapper',
    description: 'Map spreadsheet columns to your schema, in Vue 3',
    base: '/vue-sheet-mapper/docs/',
    lang: 'en-US',
    cleanUrls: true,
    lastUpdated: true,

    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vue-sheet-mapper/docs/logo.svg' }],
    ],

    themeConfig: {
        logo: '/logo.svg',

        nav: [
            { text: 'Guide', link: '/guide/installation' },
            { text: 'API', link: '/api/props' },
            { text: 'Demo', link: 'https://dazza-dev.github.io/vue-sheet-mapper/' },
            {
                text: `v${version}`,
                items: [
                    { text: 'Changelog', link: `${REPO}/blob/main/CHANGELOG.md` },
                    { text: 'npm', link: 'https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper' },
                ],
            },
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'Installation', link: '/guide/installation' },
                    { text: 'Quick start', link: '/guide/quick-start' },
                    { text: 'Validation', link: '/guide/validation' },
                    { text: 'Output modes', link: '/guide/output-modes' },
                    { text: 'Automatic behavior', link: '/guide/automatic' },
                    { text: 'File handling', link: '/guide/files' },
                    { text: 'Headless usage', link: '/guide/headless' },
                    { text: 'Global registration', link: '/guide/global' },
                ],
            },
            {
                text: 'Customization',
                items: [
                    { text: 'i18n', link: '/customization/i18n' },
                    { text: 'Icons', link: '/customization/icons' },
                    { text: 'Matcher', link: '/customization/matcher' },
                    { text: 'Transform', link: '/customization/transform' },
                    { text: 'Slots', link: '/customization/slots' },
                    { text: 'CSS theming', link: '/customization/theming' },
                ],
            },
            {
                text: 'API',
                items: [
                    { text: 'Props & events', link: '/api/props' },
                    { text: 'TypeScript types', link: '/api/types' },
                    { text: 'Exported API', link: '/api/exports' },
                ],
            },
        ],

        socialLinks: [{ icon: 'github', link: REPO }],

        editLink: {
            pattern: `${REPO}/edit/main/docs/:path`,
            text: 'Edit this page on GitHub',
        },

        search: { provider: 'local' },

        footer: {
            message: 'Released under the MIT License.',
            copyright: `© ${new Date().getFullYear()} Andres Daza`,
        },
    },
});
