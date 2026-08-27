import { defineConfig } from 'vitepress';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { version } = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'));

const REPO = 'https://github.com/dazza-dev/vue-sheet-mapper';

/** The demo owns the Pages root; the docs live under /docs/.
 *  A new language is a folder under docs/ plus an entry in `locales`. */
const versionMenu = {
    text: `v${version}`,
    items: [
        { text: 'Changelog', link: `${REPO}/blob/main/CHANGELOG.md` },
        { text: 'npm', link: 'https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper' },
    ],
};

function sidebar(t: Record<string, string>, prefix = '') {
    return [
        {
            text: t.guide,
            items: [
                { text: t.installation, link: `${prefix}/guide/installation` },
                { text: t.quickStart, link: `${prefix}/guide/quick-start` },
                { text: t.validation, link: `${prefix}/guide/validation` },
                { text: t.outputModes, link: `${prefix}/guide/output-modes` },
                { text: t.automatic, link: `${prefix}/guide/automatic` },
                { text: t.files, link: `${prefix}/guide/files` },
                { text: t.headless, link: `${prefix}/guide/headless` },
                { text: t.global, link: `${prefix}/guide/global` },
            ],
        },
        {
            text: t.customization,
            items: [
                { text: 'i18n', link: `${prefix}/customization/i18n` },
                { text: t.icons, link: `${prefix}/customization/icons` },
                { text: t.matcher, link: `${prefix}/customization/matcher` },
                { text: t.transform, link: `${prefix}/customization/transform` },
                { text: t.slots, link: `${prefix}/customization/slots` },
                { text: t.theming, link: `${prefix}/customization/theming` },
            ],
        },
        {
            text: 'API',
            items: [
                { text: t.propsEvents, link: `${prefix}/api/props` },
                { text: t.types, link: `${prefix}/api/types` },
                { text: t.exports, link: `${prefix}/api/exports` },
            ],
        },
    ];
}

const en = {
    guide: 'Guide', customization: 'Customization',
    installation: 'Installation', quickStart: 'Quick start', validation: 'Validation',
    outputModes: 'Output modes', automatic: 'Automatic behavior', files: 'File handling',
    headless: 'Headless usage', global: 'Global registration',
    icons: 'Icons', matcher: 'Matcher', transform: 'Transform', slots: 'Slots', theming: 'CSS theming',
    propsEvents: 'Props & events', types: 'TypeScript types', exports: 'Exported API',
};

const es = {
    guide: 'Guía', customization: 'Personalización',
    installation: 'Instalación', quickStart: 'Primeros pasos', validation: 'Validación',
    outputModes: 'Modos de salida', automatic: 'Comportamiento automático', files: 'Archivos',
    headless: 'Uso headless', global: 'Registro global',
    icons: 'Iconos', matcher: 'Matcher', transform: 'Transform', slots: 'Slots', theming: 'Temas CSS',
    propsEvents: 'Props y eventos', types: 'Tipos de TypeScript', exports: 'API exportada',
};

export default defineConfig({
    title: 'vue-sheet-mapper',
    description: 'Excel and CSV imports for Vue 3: users match each column of their file to one of your fields',
    base: '/vue-sheet-mapper/docs/',
    cleanUrls: true,
    lastUpdated: true,

    locales: {
        root: {
            label: 'English',
            lang: 'en-US',
            themeConfig: {
                nav: [
                    { text: 'Guide', link: '/guide/installation' },
                    { text: 'API', link: '/api/props' },
                    { text: 'Demo', link: 'https://dazza-dev.github.io/vue-sheet-mapper/' },
                    versionMenu,
                ],
                sidebar: sidebar(en),
                editLink: { pattern: `${REPO}/edit/main/docs/:path`, text: 'Edit this page on GitHub' },
            },
        },
        es: {
            label: 'Español',
            lang: 'es-ES',
            link: '/es/',
            description: 'Importar Excel y CSV en Vue 3: los usuarios indican a qué campo corresponde cada columna de su archivo',
            themeConfig: {
                nav: [
                    { text: 'Guía', link: '/es/guide/installation' },
                    { text: 'API', link: '/es/api/props' },
                    { text: 'Demo', link: 'https://dazza-dev.github.io/vue-sheet-mapper/' },
                    versionMenu,
                ],
                sidebar: sidebar(es, '/es'),
                editLink: { pattern: `${REPO}/edit/main/docs/:path`, text: 'Editar esta página en GitHub' },
                docFooter: { prev: 'Anterior', next: 'Siguiente' },
                outline: { label: 'En esta página' },
                lastUpdatedText: 'Última actualización',
                returnToTopLabel: 'Volver arriba',
                darkModeSwitchLabel: 'Tema',
                sidebarMenuLabel: 'Menú',
                langMenuLabel: 'Cambiar idioma',
                footer: {
                    message: 'Publicado bajo la licencia MIT.',
                    copyright: `© ${new Date().getFullYear()} Andres Daza`,
                },
            },
        },
    },

    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vue-sheet-mapper/docs/logo.svg' }],
    ],

    themeConfig: {
        logo: '/logo.svg',

        socialLinks: [{ icon: 'github', link: REPO }],

        search: {
            provider: 'local',
            options: {
                locales: {
                    es: {
                        translations: {
                            button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
                            modal: {
                                displayDetails: 'Ver detalles',
                                resetButtonTitle: 'Limpiar la búsqueda',
                                backButtonTitle: 'Volver',
                                noResultsText: 'Sin resultados para',
                                footer: {
                                    selectText: 'para seleccionar',
                                    navigateText: 'para navegar',
                                    closeText: 'para cerrar',
                                },
                            },
                        },
                    },
                },
            },
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright: `© ${new Date().getFullYear()} Andres Daza`,
        },
    },
});
