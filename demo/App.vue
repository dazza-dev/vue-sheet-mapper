<template>
    <div class="app">
        <!-- ─── Top bar ─────────────────────────────────────────────────── -->
        <header class="topbar">
            <div class="topbar__brand">
                <img class="topbar__logo" :src="asset('logo.svg')" alt="" width="26" height="26" />
                <span class="topbar__name">vue-sheet-mapper</span>
                <span class="topbar__tag">demo</span>
            </div>
            <div class="topbar__right">
                <div class="theme" role="group" :aria-label="t.nav.theme">
                    <button
                        v-for="opt in themes"
                        :key="opt.value"
                        type="button"
                        class="theme__btn"
                        :class="{ 'theme__btn--on': theme === opt.value }"
                        :aria-pressed="theme === opt.value"
                        :title="t.nav[opt.titleKey]"
                        @click="theme = opt.value"
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path :d="opt.path" />
                            <circle v-if="opt.circle" :cx="opt.circle[0]" :cy="opt.circle[1]" :r="opt.circle[2]" />
                        </svg>
                        <span class="sr-only">{{ t.nav[opt.titleKey] }}</span>
                    </button>
                </div>

                <div ref="localeMenu" class="lang">
                    <button
                        type="button"
                        class="topbar__action"
                        :aria-expanded="localeOpen"
                        aria-haspopup="listbox"
                        :title="`${t.nav.language} — ${activeLocale.name}`"
                        @click="localeOpen = !localeOpen"
                    >
                        <span class="lang__flag">{{ activeLocale.flag }}</span>
                        <span>{{ activeLocale.code.toUpperCase() }}</span>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>

                    <ul v-if="localeOpen" class="lang__menu" role="listbox">
                        <li v-for="l in locales" :key="l.code">
                            <button
                                type="button"
                                role="option"
                                :aria-selected="locale === l.code"
                                class="lang__item"
                                :class="{ 'lang__item--on': locale === l.code }"
                                @click="locale = l.code; localeOpen = false"
                            >
                                <span class="lang__flag">{{ l.flag }}</span>
                                <span>{{ l.name }}</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <a class="topbar__action" :href="asset('sample-contacts.xlsx')" download
                   :title="t.nav.sampleHint">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    <span>{{ t.nav.sample }}</span>
                </a>

                <button
                    type="button"
                    class="topbar__action"
                    :class="{ 'topbar__action--on': showSnippets }"
                    :aria-pressed="showSnippets"
                    :title="t.nav.snippetsHint"
                    @click="showSnippets = !showSnippets"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                    </svg>
                    <span>{{ t.nav.snippets }}</span>
                </button>

                <span class="topbar__sep" aria-hidden="true"></span>

                <span class="topbar__version">v{{ version }}</span>
                <a class="topbar__link topbar__link--npm" href="https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper"
                   target="_blank" rel="noopener" title="npm">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.331h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                    </svg>
                    <span>npm</span>
                </a>
                <a class="topbar__link topbar__link--gh" href="https://github.com/dazza-dev/vue-sheet-mapper"
                   target="_blank" rel="noopener" title="GitHub">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
                    </svg>
                    <span>GitHub</span>
                </a>
            </div>
        </header>

        <div class="body">
            <!-- ─── Sidebar ─────────────────────────────────────────────── -->
            <aside class="sidebar">
                <div class="sidebar__head">
                    <h2>{{ t.side.title }}</h2>
                    <button v-if="activeCount" class="sidebar__reset" type="button" @click="resetOptions">
                        {{ t.side.reset }}
                    </button>
                </div>

                <div class="sidebar__scroll">
                    <!-- Appearance -->
                    <PanelGroup :title="t.side.appearance" :badge="appearanceBadge">
                        <SegControl
                            v-model="useCustomIcons"
                            :label="t.appearance.icons"
                            prop=":icons"
                            :options="[
                                { label: t.appearance.default, value: false },
                                { label: t.appearance.custom, value: true },
                            ]"
                        >
                            <template #hint>
                                {{ t.appearance.iconsHint }}
                            </template>
                        </SegControl>

                        <div v-if="useCustomIcons && showSnippets" class="icon-grid">
                            <div v-for="entry in iconPreview" :key="entry.key" class="icon-grid__item">
                                <component :is="entry.default" width="18" height="18" class="icon-grid__svg" />
                                <span class="icon-grid__arrow">→</span>
                                <component :is="entry.custom" width="18" height="18" class="icon-grid__svg icon-grid__svg--custom" />
                                <code>{{ entry.key }}</code>
                            </div>
                        </div>

                        <SegControl
                            v-model="useCustomMessages"
                            :label="t.appearance.messages"
                            prop=":messages"
                            :options="[
                                { label: t.appearance.default, value: false },
                                { label: t.appearance.custom, value: true },
                            ]"
                        >
                            <template #hint>
                                {{ t.appearance.messagesHint }}
                            </template>
                        </SegControl>

                        <CodeBlock v-if="useCustomMessages && showSnippets" :code="messagesSnippet" compact />
                    </PanelGroup>

                    <!-- Behavior -->
                    <PanelGroup :title="t.side.behavior" :badge="behaviorBadge">
                        <SegControl
                            v-model="matcherMode"
                            :label="t.behavior.matcher"
                            prop=":matcher"
                            :options="[
                                { label: t.behavior.builtin, value: 'builtin' },
                                { label: t.behavior.positional, value: 'positional' },
                                { label: t.behavior.buggy, value: 'duplicating' },
                            ]"
                        >
                            <template #hint>
                                <template v-if="matcherMode === 'positional'">
                                    {{ t.behavior.positionalHint }}
                                </template>
                                <template v-else-if="matcherMode === 'duplicating'">
                                    {{ t.behavior.buggyHint }}
                                </template>
                                <template v-else>
                                    {{ t.behavior.builtinHint }}
                                </template>
                            </template>
                        </SegControl>

                        <CodeBlock v-if="matcherMode !== 'builtin' && showSnippets" :code="matcherSnippet" compact />

                        <SegControl
                            v-model="autoIgnore"
                            :label="t.behavior.autoIgnore"
                            prop=":auto-ignore"
                            :options="[
                                { label: t.behavior.off, value: false },
                                { label: t.behavior.on, value: true },
                            ]"
                        >
                            <template #hint>
                                {{ t.behavior.autoIgnoreHint }}
                            </template>
                        </SegControl>

                        <SegControl
                            v-model="autoConfirm"
                            :label="t.behavior.autoConfirm"
                            prop=":auto-confirm"
                            :options="[
                                { label: t.behavior.off, value: false },
                                { label: t.behavior.on, value: true },
                            ]"
                        >
                            <template #hint>
                                {{ t.behavior.autoConfirmHint }}
                            </template>
                        </SegControl>

                        <SegControl
                            v-model="defaultHasHeaders"
                            :label="t.behavior.firstRow"
                            prop=":default-has-headers"
                            :options="[
                                { label: t.behavior.header, value: true },
                                { label: t.behavior.data, value: false },
                            ]"
                        >
                            <template #hint>
                                {{ t.behavior.firstRowHint }}
                            </template>
                        </SegControl>

                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="previewRows">{{ t.behavior.previewRows }}</label>
                                <code class="ctl__prop">:preview-rows</code>
                            </div>
                            <div class="range">
                                <input id="previewRows" v-model.number="previewRows" type="range" min="1" max="10" />
                                <output>{{ previewRows }}</output>
                            </div>
                        </div>
                    </PanelGroup>

                    <!-- Output -->
                    <PanelGroup :title="t.side.output" :badge="outputBadge">
                        <SegControl
                            v-model="outputMode"
                            :label="t.out.mode"
                            prop="output"
                            :options="[
                                { label: 'rows', value: 'rows' },
                                { label: 'mapping', value: 'mapping' },
                            ]"
                        >
                            <template #hint>
                                <template v-if="outputMode === 'mapping'">
                                    {{ t.out.mappingHint }}
                                </template>
                                <template v-else>
                                    {{ t.out.rowsHint }}
                                </template>
                            </template>
                        </SegControl>

                        <SegControl
                            v-model="useTransform"
                            :label="t.out.transform"
                            prop=":transform"
                            :disabled="outputMode === 'mapping'"
                            :options="[
                                { label: t.behavior.off, value: false },
                                { label: t.behavior.on, value: true },
                            ]"
                        >
                            <template #hint>
                                <template v-if="outputMode === 'mapping'">
                                    {{ t.out.transformNA }}
                                </template>
                                <template v-else>
                                    {{ t.out.transformHint }}
                                </template>
                            </template>
                        </SegControl>

                        <CodeBlock v-if="useTransform && outputMode === 'rows' && showSnippets" :code="transformSnippet" compact />
                        <CodeBlock v-if="outputMode === 'mapping' && showSnippets" :code="mappingSnippet" compact />
                    </PanelGroup>

                    <!-- Schema -->
                    <PanelGroup :title="t.side.schema" :badge="schemaBadge">
                        <SegControl
                            v-model="fieldsSource"
                            :label="t.schema.source"
                            prop=":fields"
                            :options="[
                                { label: t.schema.immediate, value: 'immediate' },
                                { label: t.schema.fromApi, value: 'api' },
                            ]"
                        >
                            <template #hint>
                                <template v-if="fieldsSource === 'api'">
                                    {{ t.schema.apiHint.replace('{ms}', String(apiDelay)) }}
                                </template>
                                <template v-else>
                                    {{ t.schema.immediateHint }}
                                </template>
                            </template>
                        </SegControl>

                        <div v-if="fieldsSource === 'api'" class="ctl">
                            <div class="schema-status" :class="{ 'schema-status--loading': schemaLoading }">
                                <span class="schema-status__dot" />
                                <span>{{ schemaLoading ? t.schema.loading : t.schema.loaded.replace('{n}', String(activeFields.length)) }}</span>
                            </div>
                            <button class="btn-ghost" type="button" @click="loadSchemaFromApi">
                                {{ t.schema.simulate }}
                            </button>
                            <CodeBlock v-if="showSnippets" :code="reactiveFieldsSnippet" compact />
                        </div>
                    </PanelGroup>

                    <!-- File -->
                    <PanelGroup :title="t.side.file" :badge="fileBadge" :default-open="false">
                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="encoding">{{ t.file.encoding }}</label>
                                <code class="ctl__prop">encoding</code>
                            </div>
                            <select id="encoding" v-model="encodingOption" class="select">
                                <option value="">{{ t.file.autoDetect }}</option>
                                <option value="utf-8">utf-8</option>
                                <option value="windows-1252">windows-1252</option>
                                <option value="shift-jis">shift-jis</option>
                                <option value="gb18030">gb18030</option>
                                <option value="koi8-r">koi8-r</option>
                            </select>
                            <p class="ctl__hint">
                                {{ t.file.encodingHint }}
                            </p>
                        </div>

                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="maxSize">{{ t.file.maxSize }}</label>
                                <code class="ctl__prop">:max-file-size</code>
                            </div>
                            <select id="maxSize" v-model="maxFileSizeOption" class="select">
                                <option value="">{{ t.file.noLimit }}</option>
                                <option value="10485760">10 MB</option>
                                <option value="1048576">1 MB</option>
                                <option value="102400">100 KB</option>
                                <option value="10240">10 KB</option>
                            </select>
                        </div>

                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="maxRows">{{ t.file.maxRows }}</label>
                                <code class="ctl__prop">:max-rows</code>
                            </div>
                            <select id="maxRows" v-model="maxRowsOption" class="select">
                                <option value="">No limit</option>
                                <option value="10000">10 000</option>
                                <option value="1000">1 000</option>
                                <option value="100">100</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                    </PanelGroup>

                </div>
            </aside>

            <!-- ─── Right pane ──────────────────────────────────────────── -->
            <main class="pane">
                <nav class="tabs">
                    <button
                        v-for="item in tabs"
                        :key="item.id"
                        type="button"
                        class="tabs__btn"
                        :class="{ 'tabs__btn--on': tab === item.id }"
                        @click="tab = item.id"
                    >
                        {{ item.label }}
                        <span v-if="item.id === 'output' && outputCount" class="tabs__count">{{ outputCount }}</span>
                    </button>
                    <div class="tabs__spacer" />
                    <button class="btn-ghost" type="button" @click="remountMapper">{{ t.tabs.restart }}</button>
                </nav>

                <div class="canvas">
                    <!-- Preview: no max-width, the column cards want every pixel -->
                    <div v-show="tab === 'preview'" class="canvas__inner canvas__inner--wide">
                        <div class="stage">
                            <SheetMapper
                                :key="mapperKey"
                                :fields="activeFields"
                                :locale="locale"
                                :preview-rows="previewRows"
                                :output="outputMode"
                                :default-has-headers="defaultHasHeaders"
                                :icons="useCustomIcons ? customIcons : undefined"
                                :messages="useCustomMessages ? customMessages[locale] : undefined"
                                :matcher="matchers[matcherMode]"
                                :auto-ignore="autoIgnore"
                                :auto-confirm="autoConfirm"
                                :transform="useTransform && outputMode === 'rows' ? contactTransform : undefined"
                                :max-file-size="maxFileSizeOption ? Number(maxFileSizeOption) : undefined"
                                :max-rows="maxRowsOption ? Number(maxRowsOption) : undefined"
                :encoding="encodingOption || undefined"
                                @mapped="onMapped"
                                @error="onError"
                                @file-picked="onFilePicked"
                                @reset="clearOutput"
                            />
                        </div>
                    </div>

                    <!-- Code -->
                    <div v-show="tab === 'code'" class="canvas__inner">
                        <div class="code-card">
                            <div class="code-card__head">{{ t.code.template }}</div>
                            <CodeBlock :code="templateSnippet" lang="xml" />
                        </div>
                        <div class="code-card">
                            <div class="code-card__head">{{ t.code.schema }}</div>
                            <CodeBlock :code="fieldsSnippet" />
                        </div>
                        <div class="code-card">
                            <div class="code-card__head">{{ t.code.handler }}</div>
                            <CodeBlock :code="handlerSnippet" />
                        </div>
                    </div>

                    <!-- Output -->
                    <div v-show="tab === 'output'" class="canvas__inner">
                        <div v-if="!hasOutput" class="empty">
                            <p class="empty__title">{{ t.result.empty }}</p>
                            <p class="empty__text">
                                {{ t.result.emptyBody }}
                            </p>
                            <button class="btn-solid" type="button" @click="tab = 'preview'">{{ t.result.goPreview }}</button>
                        </div>

                        <!-- output="mapping" -->
                        <template v-else-if="mappingResult">
                            <div class="out-note">
                                <code>output="mapping"</code> — {{ t.result.mappingNote }}
                            </div>
                            <div class="out-grid">
                                <div class="out-tile">
                                    <span class="out-tile__k">file</span>
                                    <span class="out-tile__v">{{ mappingResult.file.name }}</span>
                                    <span class="out-tile__sub">{{ formatBytes(mappingResult.file.size) }}</span>
                                </div>
                                <div class="out-tile">
                                    <span class="out-tile__k">hasHeaders</span>
                                    <span class="out-tile__v">{{ mappingResult.hasHeaders }}</span>
                                    <span class="out-tile__sub">{{ mappingResult.hasHeaders ? t.result.isHeader : t.result.isData }}</span>
                                </div>
                                <div class="out-tile">
                                    <span class="out-tile__k">mapping</span>
                                    <span class="out-tile__v">{{ Object.keys(mappingResult.mapping).length }}</span>
                                    <span class="out-tile__sub">{{ t.result.columnsMapped }}</span>
                                </div>
                            </div>
                            <div class="code-card">
                                <div class="code-card__head">{{ t.result.mappingCard }}</div>
                                <CodeBlock :code="JSON.stringify(mappingResult.mapping, null, 2)" lang="typescript" />
                            </div>
                        </template>

                        <!-- transform -->
                        <template v-else-if="transformedResult">
                            <div class="out-note">
                                <code>:transform</code> — {{ t.result.transformNote.replace('{n}', String(transformedResult.length)) }}
                            </div>
                            <div class="code-card">
                                <div class="code-card__head">{{ t.result.firstRows }}</div>
                                <CodeBlock :code="JSON.stringify(transformedResult.slice(0, 3), null, 2)" lang="typescript" />
                            </div>
                        </template>

                        <!-- rows -->
                        <template v-else-if="result">
                            <div class="out-note">
                                <code>MappedResult[]</code> — {{ t.result.rowsNote.replace('{n}', String(result.length)) }}
                            </div>
                            <div class="out-cols">
                                <div v-for="col in result" :key="col.field" class="out-col">
                                    <code class="out-col__field">{{ col.field }}</code>
                                    <span class="out-col__from">← «{{ col.columnName }}»</span>
                                    <span class="out-col__rows">{{ col.data.length }} filas</span>
                                </div>
                            </div>
                            <div class="code-card">
                                <div class="code-card__head">{{ t.result.dataPreview }}</div>
                                <CodeBlock :code="resultPreview" lang="typescript" />
                            </div>
                        </template>
                    </div>
                </div>
            </main>
        </div>

        <!-- The component renders its own error inline. This is the developer-facing
             view of the @error event, so it is styled as a log line, not a second alert. -->
        <transition name="toast">
            <div v-if="lastError" class="toast">
                <code class="toast__event">@error</code>
                <span class="toast__body"><strong>{{ lastError.code }}</strong> — {{ lastError.message }}</span>
                <button type="button" aria-label="Dismiss" @click="lastError = null">×</button>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { SheetMapper, IconUpload, IconFile, IconCheck, IconBan, IconAlert } from '../src/index';
import type {
    MappedResult, MappingOutput, SchemaField, Locale, Icons,
    MessagesOverride, MatcherFn, TransformFn, SheetMapperError,
} from '../src/types';

import { version } from '../package.json';
import { demoMessages } from './i18n';
import CodeBlock from './components/CodeBlock.vue';
import PanelGroup from './components/PanelGroup.vue';
import SegControl from './components/SegControl.vue';

// Custom icon set — filled/solid style as a contrast to the default outlined icons
import UploadFilledIcon from './icons/UploadFilledIcon.vue';
import FileFilledIcon from './icons/FileFilledIcon.vue';
import CheckCircleFilledIcon from './icons/CheckCircleFilledIcon.vue';
import TriangleAlertIcon from './icons/TriangleAlertIcon.vue';
import BanFilledIcon from './icons/BanFilledIcon.vue';

const apiDelay = 1500;

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

// ─── Option state ────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark' | 'system';

const themes: { value: Theme; titleKey: 'light' | 'dark' | 'system'; path: string; circle?: [number, number, number] }[] = [
    { value: 'light',  titleKey: 'light',  path: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4', circle: [12, 12, 4] },
    { value: 'dark',   titleKey: 'dark',   path: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' },
    { value: 'system', titleKey: 'system', path: 'M4 4h16v12H4zM8 20h8M12 16v4' },
];

const theme = ref<Theme>('system');

watch(theme, (value) => {
    const root = document.documentElement;
    if (value === 'system') root.removeAttribute('data-theme');
    else root.dataset.theme = value;
    try {
        localStorage.setItem('vsm-demo-theme', value);
    } catch {
        // private mode / storage disabled — the choice just does not persist
    }
}, { immediate: true });

const locales: { code: Locale; flag: string; name: string }[] = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'pt', flag: '🇵🇹', name: 'Português' },
    { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
];

const locale = ref<Locale>('en');
const localeOpen = ref(false);
const localeMenu = ref<HTMLElement | null>(null);
const t = computed(() => demoMessages[locale.value]);
const activeLocale = computed(() => locales.find((l) => l.code === locale.value) ?? locales[0]);
const fieldsSource = ref<'immediate' | 'api'>('immediate');
const useCustomIcons = ref(false);
const useCustomMessages = ref(false);
const matcherMode = ref<'builtin' | 'positional' | 'duplicating'>('builtin');
const autoIgnore = ref(false);
const autoConfirm = ref(false);
const defaultHasHeaders = ref(true);
const previewRows = ref(4);
const outputMode = ref<'rows' | 'mapping'>('rows');
const useTransform = ref(false);
const maxFileSizeOption = ref('');
const maxRowsOption = ref('');
const encodingOption = ref('');
const showSnippets = ref(true);

// ─── UI state ────────────────────────────────────────────────────────────────

const tabIds = ['preview', 'code', 'output'] as const;
type TabId = (typeof tabIds)[number];
const tabs = computed(() => tabIds.map((id) => ({ id, label: t.value.tabs[id] })));

const tab = ref<TabId>('preview');
const mapperKey = ref(0);
const lastError = ref<SheetMapperError | null>(null);

const result = ref<MappedResult[] | null>(null);
const transformedResult = ref<Record<string, string>[] | null>(null);
const mappingResult = ref<MappingOutput | null>(null);

// ─── Schema ──────────────────────────────────────────────────────────────────

const contactFields: SchemaField[] = [
    { key: 'document_number', label: 'ID',         required: true, aliases: ['id', 'document', 'cedula', 'documento'] },
    { key: 'first_name',      label: 'First Name', required: true, aliases: ['first name', 'nombre', 'nombres'] },
    { key: 'last_name',       label: 'Last Name',  required: true, aliases: ['last name', 'apellido', 'apellidos'] },
    { key: 'email',           label: 'Email',                      aliases: ['email', 'mail', 'correo'] },
    { key: 'cellphone',       label: 'Phone',                      aliases: ['phone', 'cellphone', 'telefono', 'celular'] },
    { key: 'gender',          label: 'Gender',                     aliases: ['gender', 'genero', 'sexo'] },
    { key: 'birthdate',       label: 'Birthdate',                  aliases: ['birthdate', 'birth date', 'fecha de nacimiento'] },
    { key: 'role',            label: 'Role',                       aliases: ['role', 'job title', 'cargo', 'rol'] },
    { key: 'group',           label: 'Group',                      aliases: ['group', 'team', 'grupo', 'equipo'] },
    { key: 'city',            label: 'City',                       aliases: ['city', 'ciudad', 'municipio'] },
    { key: 'state',           label: 'State',                      aliases: ['state', 'province', 'department', 'departamento'] },
    { key: 'address',         label: 'Address',                    aliases: ['address', 'direccion'] },
    { key: 'company',         label: 'Company',                    aliases: ['company', 'organization', 'empresa'] },
    { key: 'website',         label: 'Website',                    aliases: ['website', 'url', 'sitio web'] },
    { key: 'notes',           label: 'Notes',                      aliases: ['notes', 'comments', 'notas'] },
];

// Reactive schema: `fields` is a ref, so the mapper re-runs auto-matching
// on its own when the fields land — even if the file was picked first.
const activeFields = ref<SchemaField[]>(contactFields);
const schemaLoading = ref(false);
let schemaTimer: ReturnType<typeof setTimeout> | undefined;

function loadSchemaFromApi(): void {
    clearTimeout(schemaTimer);
    activeFields.value = [];
    schemaLoading.value = true;
    schemaTimer = setTimeout(() => {
        activeFields.value = contactFields;
        schemaLoading.value = false;
    }, apiDelay);
}

watch(fieldsSource, (mode) => {
    if (mode === 'api') {
        loadSchemaFromApi();
    } else {
        clearTimeout(schemaTimer);
        schemaLoading.value = false;
        activeFields.value = contactFields;
    }
});

// Keep transform and output="mapping" mutually exclusive in the UI too
watch(outputMode, () => clearOutput());

onMounted(() => {
    try {
        const saved = localStorage.getItem('vsm-demo-theme');
        if (saved === 'light' || saved === 'dark' || saved === 'system') theme.value = saved;
    } catch {
        // storage unavailable: fall back to 'system', which is the default anyway
    }
    if (fieldsSource.value === 'api') loadSchemaFromApi();
    document.addEventListener('click', closeLocaleOnOutside, true);
    document.addEventListener('keydown', closeLocaleOnEscape);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeLocaleOnOutside, true);
    document.removeEventListener('keydown', closeLocaleOnEscape);
});

function closeLocaleOnOutside(e: MouseEvent) {
    if (localeOpen.value && !localeMenu.value?.contains(e.target as Node)) localeOpen.value = false;
}

function closeLocaleOnEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') localeOpen.value = false;
}

// ─── Customization examples ──────────────────────────────────────────────────

const contactTransform: TransformFn<{
    document_number: string; full_name: string; email: string; cellphone: string;
}> = (row) => {
    if (!row.first_name && !row.document_number) return null; // skip empty rows
    return {
        document_number: row.document_number?.trim() ?? '',
        full_name: `${(row.first_name ?? '').trim()} ${(row.last_name ?? '').trim()}`.trim(),
        email: (row.email ?? '').toLowerCase().trim(),
        cellphone: (row.cellphone ?? '').replace(/\D/g, ''),
    };
};

// Positional matcher — maps column 0 → first field, column 1 → second field, etc.
const positionalMatcher: MatcherFn = (columns, fields) => {
    const map = new Map<number, string>();
    columns.forEach((_, i) => {
        if (fields[i]) map.set(i, fields[i].key);
    });
    return map;
};

// Deliberately broken: claims the same field for every column. Exists to show
// that validate() refuses it instead of letting toRows() drop the data.
const duplicatingMatcher: MatcherFn = (columns, fields) => {
    const first = fields[0];
    if (!first) return new Map<number, string>();
    return new Map(columns.map((_, i) => [i, first.key]));
};

const matchers: Record<'builtin' | 'positional' | 'duplicating', MatcherFn | undefined> = {
    builtin: undefined,
    positional: positionalMatcher,
    duplicating: duplicatingMatcher,
};

const customMessages: Partial<Record<Locale, MessagesOverride>> = {
    es: {
        dropzone: {
            title: 'Sube aquí tu archivo de contactos',
            subtitle: 'Formatos soportados: CSV, XLS o XLSX',
            button: 'Seleccionar archivo',
            changeFile: 'Cambiar archivo',
        },
        confirm: 'Importar contactos',
    },
    en: {
        dropzone: {
            title: 'Upload your contacts file here',
            subtitle: 'Supported formats: CSV, XLS or XLSX',
            button: 'Select file',
            changeFile: 'Change file',
        },
        confirm: 'Import contacts',
    },
    fr: {
        dropzone: { title: 'Déposez votre fichier de contacts ici', subtitle: 'Formats acceptés : CSV, XLS ou XLSX' },
        confirm: 'Importer les contacts',
    },
    pt: {
        dropzone: { title: 'Envie seu arquivo de contatos aqui', subtitle: 'Formatos aceitos: CSV, XLS ou XLSX' },
        confirm: 'Importar contatos',
    },
    nl: {
        dropzone: { title: 'Upload hier uw contactenbestand', subtitle: 'Ondersteunde formaten: CSV, XLS of XLSX' },
        confirm: 'Contacten importeren',
    },
};

const customIcons: Icons = {
    upload: UploadFilledIcon,
    file: FileFilledIcon,
    assigned: CheckCircleFilledIcon,
    ignored: BanFilledIcon,
    unassigned: TriangleAlertIcon,
    confirm: CheckCircleFilledIcon,
};

const iconPreview = [
    { key: 'upload',     default: IconUpload, custom: UploadFilledIcon },
    { key: 'file',       default: IconFile,   custom: FileFilledIcon },
    { key: 'assigned',   default: IconCheck,  custom: CheckCircleFilledIcon },
    { key: 'ignored',    default: IconBan,    custom: BanFilledIcon },
    { key: 'unassigned', default: IconAlert,  custom: TriangleAlertIcon },
    { key: 'confirm',    default: IconCheck,  custom: CheckCircleFilledIcon },
];

// ─── Derived ─────────────────────────────────────────────────────────────────

const schemaBadge = computed(() => (fieldsSource.value === 'api' ? 1 : 0));
const appearanceBadge = computed(
    () => Number(useCustomIcons.value) + Number(useCustomMessages.value),
);
const behaviorBadge = computed(
    () => Number(matcherMode.value !== 'builtin') + Number(autoIgnore.value) + Number(autoConfirm.value)
        + Number(!defaultHasHeaders.value) + Number(previewRows.value !== 4),
);
const outputBadge = computed(() => Number(outputMode.value !== 'rows') + Number(useTransform.value));
const fileBadge = computed(
    () => Number(!!encodingOption.value) + Number(!!maxFileSizeOption.value) + Number(!!maxRowsOption.value),
);
const activeCount = computed(
    () => schemaBadge.value + appearanceBadge.value + behaviorBadge.value + outputBadge.value + fileBadge.value,
);

const hasOutput = computed(() => !!(result.value || transformedResult.value || mappingResult.value));
const outputCount = computed(() => {
    if (mappingResult.value) return Object.keys(mappingResult.value.mapping).length;
    if (transformedResult.value) return transformedResult.value.length;
    return result.value?.length ?? 0;
});

const resultPreview = computed(() =>
    JSON.stringify(result.value?.map((c) => ({ field: c.field, preview: c.data.slice(0, 3) })) ?? [], null, 2),
);

const templateSnippet = computed(() => {
    const lines = ['  :fields="fields"', `  locale="${locale.value}"`];
    if (outputMode.value === 'mapping') lines.push('  output="mapping"');
    if (previewRows.value !== 5) lines.push(`  :preview-rows="${previewRows.value}"`);
    if (!defaultHasHeaders.value) lines.push('  :default-has-headers="false"');
    if (useCustomIcons.value) lines.push('  :icons="customIcons"');
    if (useCustomMessages.value) lines.push('  :messages="customMessages[locale]"');
    if (matcherMode.value !== 'builtin') lines.push(`  :matcher="${matcherMode.value === 'positional' ? 'positionalMatcher' : 'duplicatingMatcher'}"`);
    if (autoIgnore.value) lines.push('  :auto-ignore="true"');
    if (autoConfirm.value) lines.push('  :auto-confirm="true"');
    if (useTransform.value && outputMode.value === 'rows') lines.push('  :transform="contactTransform"');
    if (maxFileSizeOption.value) lines.push(`  :max-file-size="${maxFileSizeOption.value}"`);
    if (maxRowsOption.value) lines.push(`  :max-rows="${maxRowsOption.value}"`);
    if (encodingOption.value) lines.push(`  encoding="${encodingOption.value}"`);
    lines.push('  @mapped="onMapped"', '  @error="onError"');
    return `<SheetMapper\n${lines.join('\n')}\n/>`;
});

const fieldsSnippet = computed(() =>
    fieldsSource.value === 'api'
        ? `import { ref, onMounted } from 'vue';
import type { SchemaField } from '@dazzadev/vue-sheet-mapper';

// A ref works as well as a plain array — useSheetMapper takes
// MaybeRefOrGetter<SchemaField[]>, so the mapper re-runs auto-matching
// on its own when the fields land, even if the file was picked first.
const fields = ref<SchemaField[]>([]);

onMounted(async () => {
    fields.value = await fetch('/api/import/fields').then((r) => r.json());
});`
        : `import type { SchemaField } from '@dazzadev/vue-sheet-mapper';

const fields: SchemaField[] = [
    { key: 'document_number', label: 'ID',         required: true, aliases: ['id', 'documento'] },
    { key: 'first_name',      label: 'First Name', required: true, aliases: ['nombre', 'nombres'] },
    { key: 'email',           label: 'Email',                      aliases: ['mail', 'correo'] },
    // …
];`,
);

const handlerSnippet = computed(() => {
    if (outputMode.value === 'mapping') {
        return `import type { MappingOutput } from '@dazzadev/vue-sheet-mapper';

// The library never issues a request and never builds a FormData.
// You get three primitives, so any backend works — this one happens to be Laravel.
async function onMapped(payload: MappingOutput) {
    const body = new FormData();
    body.append('file', payload.file);
    body.append('mapping', JSON.stringify(payload.mapping)); // { 0: 'first_name', 2: 'email' }
    body.append('header_row', payload.hasHeaders ? '0' : '-1');

    await fetch('/api/bulk-import', { method: 'POST', body });
}`;
    }
    if (useTransform.value) {
        return `// With :transform, @mapped emits your own row shape
function onMapped(rows: Contact[]) {
    // [{ document_number: '1020…', full_name: 'Ana García', … }, …]
}`;
    }
    return `import type { MappedResult } from '@dazzadev/vue-sheet-mapper';
import { toRows } from '@dazzadev/vue-sheet-mapper';

function onMapped(results: MappedResult[]) {
    // One entry per assigned column
    const rows = toRows(results); // …or convert to row objects
}`;
});

// Sidebar snippets are deliberately narrow — they render inside a ~300px
// column. The full-width versions live in the "Code" tab.

const reactiveFieldsSnippet = `const fields = ref<SchemaField[]>([]);

onMounted(async () => {
  fields.value = await fetchFields();
});

// Auto-matching re-runs when they
// arrive, without overwriting what the
// user already set, ignored or cleared.`;

const matcherSnippet = computed(() =>
    matcherMode.value === 'duplicating'
        ? `const duplicating: MatcherFn = (cols, f) => {
  // el bug: el mismo campo para todas
  return new Map(cols.map((_, i) => [i, f[0].key]));
};

// validate() lo detecta y devuelve null:
// { code: 'DUPLICATE_ASSIGNMENTS',
//   duplicateFields: ['...'] }`
        : `const positional: MatcherFn = (cols, f) => {
  const map = new Map<number, string>();
  cols.forEach((_, i) => {
    if (f[i]) map.set(i, f[i].key);
  });
  return map;
};

// Las claves del Map son posiciones
// del array \`columns\`, no col.index.`,
);

const messagesSnippet = `const customMessages: Partial<
  Record<Locale, MessagesOverride>
> = {
  es: {
    dropzone: { title: 'Sube tu archivo' },
    confirm: 'Importar contactos',
  },
};

// :messages="customMessages[locale]"`;

const transformSnippet = `const toContact: TransformFn<Contact> =
(row) => {
  if (!row.first_name) return null;
  const fn = row.first_name?.trim() ?? '';
  const ln = row.last_name?.trim() ?? '';
  return {
    full_name: \`\${fn} \${ln}\`.trim(),
    email: row.email?.toLowerCase() ?? '',
  };
};`;

const mappingSnippet = `async function onMapped(p: MappingOutput) {
  const body = new FormData();
  body.append('file', p.file);
  body.append('mapping',
    JSON.stringify(p.mapping));
  body.append('header_row',
    p.hasHeaders ? '0' : '-1');
  await fetch('/api/import', {
    method: 'POST', body,
  });
}`;

// ─── Handlers ────────────────────────────────────────────────────────────────

function clearOutput(): void {
    result.value = null;
    transformedResult.value = null;
    mappingResult.value = null;
}

function onMapped(data: MappedResult[] | MappingOutput | unknown[]): void {
    clearOutput();
    if (outputMode.value === 'mapping') {
        mappingResult.value = data as MappingOutput;
    } else if (useTransform.value) {
        transformedResult.value = data as Record<string, string>[];
    } else {
        result.value = data as MappedResult[];
    }
    tab.value = 'output';
    console.log('mapped:', data);
}

function onError(err: SheetMapperError): void {
    lastError.value = err;
    console.error('error:', err);
}

function onFilePicked(f: File): void {
    lastError.value = null;
    console.log('file picked:', f.name);
}

function remountMapper(): void {
    clearOutput();
    lastError.value = null;
    mapperKey.value++;
    tab.value = 'preview';
}

function resetOptions(): void {
    fieldsSource.value = 'immediate';
    useCustomIcons.value = false;
    useCustomMessages.value = false;
    matcherMode.value = 'builtin';
    autoIgnore.value = false;
    autoConfirm.value = false;
    defaultHasHeaders.value = true;
    previewRows.value = 4;
    outputMode.value = 'rows';
    useTransform.value = false;
    maxFileSizeOption.value = '';
    maxRowsOption.value = '';
    encodingOption.value = '';
    remountMapper();
}

function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
}
</script>

<style>
:root {
    --d-bg: #f1f3f6;
    --d-surface: #ffffff;
    --d-line: #e4e7ec;
    --d-text: #101828;
    --d-text-dim: #667085;
    --d-text-faint: #98a2b3;
    --d-accent: #0f8a5f;
    --d-accent-soft: #e6f7ef;
    --d-hover: #f7f8fa;
    --d-code-bg: #1e1e2e;
    --d-code-fg: #cdd6f4;

    /* Chrome is dark in every theme — it is the tool, not the content. */
    --d-chrome: #16181d;
    --d-chrome-line: #262a33;
    --d-chrome-text: #e6e9ef;
    --d-chrome-dim: #98a2b3;
    --d-chrome-faint: #6b7480;
    --d-chrome-hover: rgba(255, 255, 255, 0.06);
    --d-chrome-accent: #42b883;
    --d-chrome-accent-soft: rgba(66, 184, 131, 0.2);
    --d-chrome-group: #1e222a;
    --d-chrome-group-hover: #262b35;

    --d-sidebar-w: 332px;
    --d-topbar-h: 52px;
    --d-tabs-h: 48px;
}

/* The dark palette lives in one place; both selectors below pull it in. */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) {
        --d-bg: #0d0f13;
        --d-surface: #16181d;
        --d-line: #262a33;
        --d-text: #e6e9ef;
        --d-text-dim: #98a2b3;
        --d-text-faint: #6b7480;
        --d-accent: #42b883;
        --d-accent-soft: rgba(66, 184, 131, 0.18);
        --d-hover: rgba(255, 255, 255, 0.05);
        --d-code-bg: #11131a;
        --d-code-fg: #cdd6f4;
    }
}

:root[data-theme='dark'] {
    --d-bg: #0d0f13;
    --d-surface: #16181d;
    --d-line: #262a33;
    --d-text: #e6e9ef;
    --d-text-dim: #98a2b3;
    --d-text-faint: #6b7480;
    --d-accent: #42b883;
    --d-accent-soft: rgba(66, 184, 131, 0.18);
    --d-hover: rgba(255, 255, 255, 0.05);
    --d-code-bg: #11131a;
    --d-code-fg: #cdd6f4;
}

/* The library is themed through its own custom properties — the demo doubles
   as proof that a dark skin needs no component changes. */
:root[data-theme='dark'] .vsm,
:root[data-theme='dark'] .stage {
    color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) .vsm,
    :root:not([data-theme='light']) .stage {
        color-scheme: dark;
    }
}

* { box-sizing: border-box; }

html, body { height: 100%; }

body {
    margin: 0;
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    background: var(--d-bg);
    color: var(--d-text);
    -webkit-font-smoothing: antialiased;
}

.app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ─── Top bar ─────────────────────────────────────────────────────────── */

.topbar {
    height: var(--d-topbar-h);
    flex-shrink: 0;
    background: var(--d-chrome);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
}

.topbar__brand {
    display: flex;
    align-items: center;
    gap: 9px;
}

.topbar__logo {
    display: block;
    border-radius: 6px;
}

.topbar__name {
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.01em;
}

.topbar__tag {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #42b883;
    background: rgba(66, 184, 131, 0.16);
    padding: 3px 7px;
    border-radius: 4px;
}

.topbar__right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.topbar__action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
    font-size: 12.5px;
    font-weight: 500;
    color: #d0d5dd;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 7px;
    padding: 5px 10px;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
}

.topbar__action:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}

.topbar__action--on {
    background: rgba(66, 184, 131, 0.18);
    border-color: rgba(66, 184, 131, 0.5);
    color: #6ee7b7;
}

.theme {
    display: inline-flex;
    gap: 2px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 7px;
    padding: 2px;
}

.theme__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 24px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: #98a2b3;
    cursor: pointer;
    padding: 0;
}

.theme__btn:hover { color: #fff; }

.theme__btn--on {
    background: rgba(66, 184, 131, 0.2);
    color: #6ee7b7;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
}

/* Dark skin for the library, applied purely through its public custom
   properties — no component code is involved. */
:root[data-theme='dark'] .stage .vsm {
    --vsm-text-color: #e6e9ef;
    --vsm-muted-color: #98a2b3;
    --vsm-border-color: #2f3441;
    --vsm-card-bg: #1b1e25;
    --vsm-dropzone-bg: #14161c;
    --vsm-dropzone-hover-bg: #1b2030;
    --vsm-input-bg: #1b1e25;
    --vsm-primary: #3b82f6;
    --vsm-primary-hover: #60a5fa;
    --vsm-link-color: #60a5fa;
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) .stage .vsm {
        --vsm-text-color: #e6e9ef;
        --vsm-muted-color: #98a2b3;
        --vsm-border-color: #2f3441;
        --vsm-card-bg: #1b1e25;
        --vsm-dropzone-bg: #14161c;
        --vsm-dropzone-hover-bg: #1b2030;
        --vsm-input-bg: #1b1e25;
        --vsm-primary: #3b82f6;
        --vsm-primary-hover: #60a5fa;
        --vsm-link-color: #60a5fa;
    }
}

.lang {
    position: relative;
}

.lang__flag {
    font-size: 14px;
    line-height: 1;
}

.lang__menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 60;
    margin: 0;
    padding: 4px;
    list-style: none;
    min-width: 168px;
    background: #1c1f26;
    border: 1px solid #2c3038;
    border-radius: 9px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

.lang__item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 9px;
    font: inherit;
    font-size: 13px;
    color: #d0d5dd;
    background: none;
    border: 0;
    border-radius: 6px;
    padding: 7px 9px;
    cursor: pointer;
    text-align: left;
}

.lang__item:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
}

.lang__item--on {
    color: #6ee7b7;
    background: rgba(66, 184, 131, 0.16);
}

.topbar__sep {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.12);
    margin: 0 2px;
}

.topbar__version {
    font-size: 12px;
    color: #98a2b3;
    font-variant-numeric: tabular-nums;
}

.topbar__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #d0d5dd;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 6px;
    border: 1px solid transparent;
}

.topbar__link:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

.topbar__link--npm svg { color: #cb3837; }
.topbar__link--npm:hover { border-color: rgba(203, 56, 55, 0.55); }

.topbar__link--gh svg { color: #fff; }
.topbar__link--gh:hover { border-color: rgba(255, 255, 255, 0.28); }

/* ─── Layout ──────────────────────────────────────────────────────────── */

.body {
    flex: 1;
    display: flex;
    min-height: 0;
}

.sidebar {
    /* Redefining the shared tokens here is what makes every nested control —
       PanelGroup, SegControl, selects — go dark without touching their CSS. */
    --d-surface: var(--d-chrome);
    --d-line: var(--d-chrome-line);
    --d-text: var(--d-chrome-text);
    --d-text-dim: var(--d-chrome-dim);
    --d-text-faint: var(--d-chrome-faint);
    --d-hover: var(--d-chrome-hover);
    --d-accent: var(--d-chrome-accent);
    --d-accent-soft: var(--d-chrome-accent-soft);
    --d-group-head: var(--d-chrome-group);
    --d-group-head-hover: var(--d-chrome-group-hover);

    width: var(--d-sidebar-w);
    flex-shrink: 0;
    background: var(--d-chrome);
    border-right: 1px solid var(--d-chrome-line);
    color: var(--d-chrome-text);
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.sidebar__head {
    height: var(--d-tabs-h);
    flex-shrink: 0;
    padding: 0 16px;
    border-bottom: 1px solid var(--d-line);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sidebar__head h2 {
    margin: 0;
    font-size: 13px;
    font-weight: 650;
}

.sidebar__reset {
    background: none;
    border: 0;
    font: inherit;
    font-size: 12px;
    color: var(--d-accent);
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 5px;
}

.sidebar__reset:hover { background: var(--d-accent-soft); }

.sidebar__scroll {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

/* ─── Tabs ────────────────────────────────────────────────────────────── */

.tabs {
    height: var(--d-tabs-h);
    flex-shrink: 0;
    background: var(--d-surface);
    border-bottom: 1px solid var(--d-line);
    display: flex;
    align-items: stretch;
    padding: 0 12px;
    gap: 2px;
}

.tabs__spacer { flex: 1; }

.tabs__btn {
    position: relative;
    background: none;
    border: 0;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--d-text-dim);
    padding: 0 14px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
}

.tabs__btn:hover { color: var(--d-text); }

.tabs__btn--on { color: var(--d-accent); font-weight: 600; }

.tabs__btn--on::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: -1px;
    height: 2px;
    background: var(--d-accent);
    border-radius: 2px 2px 0 0;
}

.tabs__count {
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--d-accent-soft);
    color: var(--d-accent);
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.tabs .btn-ghost { align-self: center; }

/* ─── Canvas ──────────────────────────────────────────────────────────── */

.canvas {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.canvas__inner {
    padding: 24px;
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.canvas__inner--wide { max-width: none; }

.stage {
    background: var(--d-surface);
    border: 1px solid var(--d-line);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

/* ─── Controls ────────────────────────────────────────────────────────── */

.ctl { display: flex; flex-direction: column; gap: 7px; }

.ctl--disabled { opacity: 0.45; pointer-events: none; }

.ctl__top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}

.ctl__label {
    font-size: 12.5px;
    font-weight: 550;
    color: var(--d-text);
}

.ctl__prop {
    font-size: 10.5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    color: var(--d-text-faint);
}

.ctl__hint {
    margin: 0;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--d-text-dim);
}

.ctl__hint code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10.5px;
    background: var(--d-hover);
    border: 1px solid var(--d-line);
    border-radius: 3px;
    padding: 0 3px;
}

.seg {
    display: flex;
    background: var(--d-hover);
    border: 1px solid var(--d-line);
    border-radius: 7px;
    padding: 2px;
    gap: 2px;
}

.seg__btn {
    flex: 1;
    border: 0;
    background: none;
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    color: var(--d-text-dim);
    padding: 6px 8px;
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.seg__btn:hover:not(.seg__btn--on) { color: var(--d-text); }

.seg__btn--on {
    background: #42b883;
    color: #06231a;
    font-weight: 650;
    box-shadow: 0 1px 2px rgba(6, 35, 26, 0.25);
}

.select {
    width: 100%;
    font: inherit;
    font-size: 12.5px;
    color: var(--d-text);
    background: var(--d-surface);
    border: 1px solid var(--d-line);
    border-radius: 7px;
    padding: 7px 9px;
    cursor: pointer;
}

.select:focus-visible { outline: 2px solid var(--d-accent); outline-offset: -1px; }

.range { display: flex; align-items: center; gap: 10px; }

.range input { flex: 1; accent-color: var(--d-accent); }

.range output {
    min-width: 26px;
    text-align: center;
    font-size: 12px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    color: var(--d-accent);
    background: var(--d-accent-soft);
    border-radius: 5px;
    padding: 3px 0;
}

.btn-ghost {
    display: inline-block;
    text-decoration: none;
    align-self: flex-start;
    font: inherit;
    font-size: 12px;
    color: var(--d-text-dim);
    background: var(--d-surface);
    border: 1px solid var(--d-line);
    border-radius: 6px;
    padding: 5px 10px;
    cursor: pointer;
}

.btn-ghost:hover { background: var(--d-hover); color: var(--d-text); }

.btn-solid {
    font: inherit;
    font-size: 13px;
    font-weight: 550;
    color: #fff;
    background: var(--d-accent);
    border: 0;
    border-radius: 7px;
    padding: 9px 16px;
    cursor: pointer;
}

.btn-solid:hover { filter: brightness(1.08); }

/* ─── Schema status ───────────────────────────────────────────────────── */

.schema-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--d-text-dim);
    background: var(--d-hover);
    border: 1px solid var(--d-line);
    border-radius: 7px;
    padding: 8px 10px;
}

.schema-status__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #12b76a;
    flex-shrink: 0;
}

.schema-status--loading .schema-status__dot {
    background: #f79009;
    animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse { 50% { opacity: 0.25; } }

/* ─── Snippets ────────────────────────────────────────────────────────── */

.icon-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
}

.icon-grid__item {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--d-hover);
    border: 1px solid var(--d-line);
    border-radius: 6px;
    padding: 6px 7px;
}

.icon-grid__item code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 9.5px;
    color: var(--d-text-dim);
    margin-left: auto;
}

.icon-grid__svg { color: var(--d-text-faint); flex-shrink: 0; }
.icon-grid__svg--custom { color: var(--d-accent); }
.icon-grid__arrow { color: var(--d-text-faint); font-size: 10px; }

/* ─── Code cards ──────────────────────────────────────────────────────── */

.code-card {
    background: var(--d-surface);
    border: 1px solid var(--d-line);
    border-radius: 10px;
    overflow: hidden;
}

.code-card__head {
    padding: 10px 14px;
    border-bottom: 1px solid var(--d-line);
    font-size: 12px;
    font-weight: 600;
    color: var(--d-text-dim);
}

.code-card__head code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
}

/* ─── Output ──────────────────────────────────────────────────────────── */

.empty {
    text-align: center;
    padding: 64px 24px;
    background: var(--d-surface);
    border: 1px dashed var(--d-line);
    border-radius: 12px;
}

.empty__title { margin: 0 0 6px; font-size: 15px; font-weight: 600; }

.empty__text {
    margin: 0 auto 18px;
    max-width: 380px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--d-text-dim);
}

.empty__text code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
}

.out-note {
    font-size: 12.5px;
    color: var(--d-text-dim);
    background: var(--d-accent-soft);
    border: 1px solid #dfe4ff;
    border-radius: 8px;
    padding: 10px 12px;
}

.out-note code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11.5px;
    color: var(--d-accent);
    font-weight: 600;
}

.out-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
}

.out-tile {
    background: var(--d-surface);
    border: 1px solid var(--d-line);
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.out-tile__k {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10.5px;
    color: var(--d-text-faint);
}

.out-tile__v {
    font-size: 16px;
    font-weight: 650;
    word-break: break-all;
}

.out-tile__sub { font-size: 11.5px; color: var(--d-text-dim); }

.out-cols { display: flex; flex-direction: column; gap: 5px; }

.out-col {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--d-surface);
    border: 1px solid var(--d-line);
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 12.5px;
}

.out-col__field {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11.5px;
    font-weight: 650;
    color: var(--d-accent);
}

.out-col__from { color: var(--d-text-dim); }
.out-col__rows { margin-left: auto; color: var(--d-text-faint); font-size: 11.5px; }

/* ─── Toast ───────────────────────────────────────────────────────────── */

.toast {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 480px;
    background: var(--d-chrome);
    border: 1px solid var(--d-chrome-line);
    color: #d0d5dd;
    border-radius: 10px;
    padding: 11px 13px;
    font-size: 12.5px;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.22);
}

.toast__event {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    color: #fda29b;
    background: rgba(253, 162, 155, 0.14);
    border-radius: 4px;
    padding: 2px 6px;
    flex-shrink: 0;
}

.toast__body strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11.5px;
    color: #fff;
}

.toast button {
    margin-left: auto;
    background: none;
    border: 0;
    color: inherit;
    opacity: 0.6;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    padding: 0 2px;
}

.toast-enter-active, .toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }

/* ─── Responsive ──────────────────────────────────────────────────────── */

@media (max-width: 900px) {
    .topbar__action span { display: none; }
    .topbar__action { padding: 6px 8px; }
    .app { height: auto; overflow: visible; }
    .body { flex-direction: column; }
    .sidebar { width: 100%; border-right: 0; border-bottom: 1px solid var(--d-line); }
    .sidebar__scroll { overflow-y: visible; }
    .canvas { overflow-y: visible; }
    .canvas__inner { padding: 16px; }
}
</style>
