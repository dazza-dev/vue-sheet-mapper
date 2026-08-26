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
                <span class="topbar__version">v{{ version }}</span>
                <a class="topbar__link" href="https://www.npmjs.com/package/@dazzadev/vue-sheet-mapper" target="_blank" rel="noopener">npm</a>
                <a class="topbar__link topbar__link--solid" href="https://github.com/dazza-dev/vue-sheet-mapper" target="_blank" rel="noopener">GitHub</a>
            </div>
        </header>

        <div class="body">
            <!-- ─── Sidebar ─────────────────────────────────────────────── -->
            <aside class="sidebar">
                <div class="sidebar__head">
                    <h2>Settings</h2>
                    <button v-if="activeCount" class="sidebar__reset" type="button" @click="resetOptions">
                        Reset all
                    </button>
                </div>

                <div class="sidebar__scroll">
                    <!-- Schema -->
                    <PanelGroup title="Schema" :badge="schemaBadge">
                        <SegControl
                            v-model="fieldsSource"
                            label="Field source"
                            prop=":fields"
                            :options="[
                                { label: 'Immediate', value: 'immediate' },
                                { label: 'From an API', value: 'api' },
                            ]"
                        >
                            <template #hint>
                                <template v-if="fieldsSource === 'api'">
                                    Fields arrive {{ apiDelay }} ms later, the way a schema fetched from your backend does.
                                    Pick the file before they land — auto-matching applies itself the moment they do.
                                </template>
                                <template v-else>
                                    The schema is available from the first render.
                                </template>
                            </template>
                        </SegControl>

                        <div v-if="fieldsSource === 'api'" class="ctl">
                            <div class="schema-status" :class="{ 'schema-status--loading': schemaLoading }">
                                <span class="schema-status__dot" />
                                <span>{{ schemaLoading ? 'Loading schema…' : `${activeFields.length} fields loaded` }}</span>
                            </div>
                            <button class="btn-ghost" type="button" @click="loadSchemaFromApi">
                                Simulate the fetch again
                            </button>
                            <pre v-if="showSnippets" class="snippet">{{ reactiveFieldsSnippet }}</pre>
                        </div>
                    </PanelGroup>

                    <!-- Appearance -->
                    <PanelGroup title="Appearance" :badge="appearanceBadge">
                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="locale">Language</label>
                                <code class="ctl__prop">locale</code>
                            </div>
                            <select id="locale" v-model="locale" class="select">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="pt">Português</option>
                                <option value="nl">Nederlands</option>
                            </select>
                        </div>

                        <SegControl
                            v-model="useCustomIcons"
                            label="Icons"
                            prop=":icons"
                            :options="[
                                { label: 'Default', value: false },
                                { label: 'Custom', value: true },
                            ]"
                        >
                            <template #hint>
                                Partial override: only the keys you pass are replaced, everything else keeps the default icon.
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
                            label="Messages"
                            prop=":messages"
                            :options="[
                                { label: 'Default', value: false },
                                { label: 'Custom', value: true },
                            ]"
                        >
                            <template #hint>
                                Partial override per locale, merged with the base strings of the active language.
                            </template>
                        </SegControl>

                        <pre v-if="useCustomMessages && showSnippets" class="snippet">{{ messagesSnippet }}</pre>
                    </PanelGroup>

                    <!-- Behavior -->
                    <PanelGroup title="Behavior" :badge="behaviorBadge">
                        <SegControl
                            v-model="useCustomMatcher"
                            label="Auto-match"
                            prop=":matcher"
                            :options="[
                                { label: 'Built-in', value: false },
                                { label: 'Positional', value: true },
                            ]"
                        >
                            <template #hint>
                                <template v-if="useCustomMatcher">
                                    Column 1 → field 1, column 2 → field 2, ignoring the header names.
                                </template>
                                <template v-else>
                                    Matches the column name against <code>key</code>, <code>label</code> and <code>aliases</code>, accent-insensitive.
                                </template>
                            </template>
                        </SegControl>

                        <pre v-if="useCustomMatcher && showSnippets" class="snippet">{{ matcherSnippet }}</pre>

                        <SegControl
                            v-model="autoIgnore"
                            label="Auto-ignore"
                            prop=":auto-ignore"
                            :options="[
                                { label: 'Off', value: false },
                                { label: 'On', value: true },
                            ]"
                        >
                            <template #hint>
                                Unmatched columns are pre-set to “ignore”, so the user only reviews the ones that were recognized.
                            </template>
                        </SegControl>

                        <SegControl
                            v-model="autoConfirm"
                            label="Auto-confirm"
                            prop=":auto-confirm"
                            :options="[
                                { label: 'Off', value: false },
                                { label: 'On', value: true },
                            ]"
                        >
                            <template #hint>
                                If everything is valid after auto-matching, the UI is skipped and <code>@mapped</code> fires right away.
                            </template>
                        </SegControl>

                        <SegControl
                            v-model="defaultHasHeaders"
                            label="First row"
                            prop=":default-has-headers"
                            :options="[
                                { label: 'Header', value: true },
                                { label: 'Data', value: false },
                            ]"
                        >
                            <template #hint>
                                How row 1 is read on load. The user can flip it from the preview.
                            </template>
                        </SegControl>

                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="previewRows">Preview rows</label>
                                <code class="ctl__prop">:preview-rows</code>
                            </div>
                            <div class="range">
                                <input id="previewRows" v-model.number="previewRows" type="range" min="1" max="10" />
                                <output>{{ previewRows }}</output>
                            </div>
                        </div>
                    </PanelGroup>

                    <!-- Output -->
                    <PanelGroup title="Output" :badge="outputBadge">
                        <SegControl
                            v-model="outputMode"
                            label="Output mode"
                            prop="output"
                            :options="[
                                { label: 'rows', value: 'rows' },
                                { label: 'mapping', value: 'mapping' },
                            ]"
                        >
                            <template #hint>
                                <template v-if="outputMode === 'mapping'">
                                    <code>@mapped</code> hands you <code>{ file, mapping, hasHeaders }</code>: the raw file and the column
                                    dictionary, so your backend does the reading. Nothing is materialized into row objects.
                                </template>
                                <template v-else>
                                    <code>@mapped</code> hands you <code>MappedResult[]</code>: the file is read in the browser and the values travel as JSON.
                                </template>
                            </template>
                        </SegControl>

                        <SegControl
                            v-model="useTransform"
                            label="Transform"
                            prop=":transform"
                            :disabled="outputMode === 'mapping'"
                            :options="[
                                { label: 'Off', value: false },
                                { label: 'On', value: true },
                            ]"
                        >
                            <template #hint>
                                <template v-if="outputMode === 'mapping'">
                                    Not available with <code>output="mapping"</code>: they are mutually exclusive, since nothing is converted into rows.
                                </template>
                                <template v-else>
                                    Turns columns into row objects: trims whitespace, joins first and last name, normalizes the phone number.
                                </template>
                            </template>
                        </SegControl>

                        <pre v-if="useTransform && outputMode === 'rows' && showSnippets" class="snippet">{{ transformSnippet }}</pre>
                        <pre v-if="outputMode === 'mapping' && showSnippets" class="snippet">{{ mappingSnippet }}</pre>
                    </PanelGroup>

                    <!-- File -->
                    <PanelGroup title="File" :badge="fileBadge" :default-open="false">
                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="encoding">Encoding</label>
                                <code class="ctl__prop">encoding</code>
                            </div>
                            <select id="encoding" v-model="encodingOption" class="select">
                                <option value="">Detect automatically</option>
                                <option value="utf-8">utf-8</option>
                                <option value="windows-1252">windows-1252</option>
                                <option value="shift-jis">shift-jis</option>
                                <option value="gb18030">gb18030</option>
                                <option value="koi8-r">koi8-r</option>
                            </select>
                            <p class="ctl__hint">
                                Text files only. Detection already handles UTF-8 with or without a BOM, UTF-16
                                and Windows-1252 with no configuration. Set it only for a legacy encoding that
                                detection cannot reach.
                            </p>
                        </div>

                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="maxSize">Max file size</label>
                                <code class="ctl__prop">:max-file-size</code>
                            </div>
                            <select id="maxSize" v-model="maxFileSizeOption" class="select">
                                <option value="">No limit</option>
                                <option value="10485760">10 MB</option>
                                <option value="1048576">1 MB</option>
                                <option value="102400">100 KB</option>
                                <option value="10240">10 KB</option>
                            </select>
                        </div>

                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label" for="maxRows">Max rows</label>
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

                    <!-- Sidebar preferences -->
                    <PanelGroup title="This demo" :default-open="false">
                        <div class="ctl">
                            <div class="ctl__top">
                                <label class="ctl__label">Sample file</label>
                            </div>
                            <a class="btn-ghost" :href="asset('sample-contacts.xlsx')" download>
                                Download contacts.xlsx
                            </a>
                            <p class="ctl__hint">20 contacts, 14 columns. Two of them (<code>Internal Ref</code>, <code>Legacy Code</code>) match no field on purpose, so you can see the unassigned and ignored states.</p>
                        </div>

                        <SegControl
                            v-model="showSnippets"
                            label="Code snippets"
                            :options="[
                                { label: 'Hide', value: false },
                                { label: 'Show', value: true },
                            ]"
                        >
                            <template #hint>
                                Shows the code for each option right here, under the control that turns it on.
                            </template>
                        </SegControl>
                    </PanelGroup>
                </div>
            </aside>

            <!-- ─── Right pane ──────────────────────────────────────────── -->
            <main class="pane">
                <nav class="tabs">
                    <button
                        v-for="t in tabs"
                        :key="t.id"
                        type="button"
                        class="tabs__btn"
                        :class="{ 'tabs__btn--on': tab === t.id }"
                        @click="tab = t.id"
                    >
                        {{ t.label }}
                        <span v-if="t.id === 'output' && outputCount" class="tabs__count">{{ outputCount }}</span>
                    </button>
                    <div class="tabs__spacer" />
                    <button class="btn-ghost" type="button" @click="remountMapper">Restart</button>
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
                                :matcher="useCustomMatcher ? positionalMatcher : undefined"
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
                            <div class="code-card__head">Template</div>
                            <pre class="code-card__body">{{ templateSnippet }}</pre>
                        </div>
                        <div class="code-card">
                            <div class="code-card__head">Schema</div>
                            <pre class="code-card__body">{{ fieldsSnippet }}</pre>
                        </div>
                        <div class="code-card">
                            <div class="code-card__head"><code>@mapped</code> handler</div>
                            <pre class="code-card__body">{{ handlerSnippet }}</pre>
                        </div>
                    </div>

                    <!-- Output -->
                    <div v-show="tab === 'output'" class="canvas__inner">
                        <div v-if="!hasOutput" class="empty">
                            <p class="empty__title">No output yet</p>
                            <p class="empty__text">
                                Upload a file in the preview, map the columns and confirm.
                                Whatever <code>@mapped</code> emits shows up here.
                            </p>
                            <button class="btn-solid" type="button" @click="tab = 'preview'">Go to the preview</button>
                        </div>

                        <!-- output="mapping" -->
                        <template v-else-if="mappingResult">
                            <div class="out-note">
                                <code>output="mapping"</code> — the file was not transformed. This is what you would send to your backend.
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
                                    <span class="out-tile__sub">row 1 {{ mappingResult.hasHeaders ? 'is a header' : 'is data' }}</span>
                                </div>
                                <div class="out-tile">
                                    <span class="out-tile__k">mapping</span>
                                    <span class="out-tile__v">{{ Object.keys(mappingResult.mapping).length }}</span>
                                    <span class="out-tile__sub">columns mapped</span>
                                </div>
                            </div>
                            <div class="code-card">
                                <div class="code-card__head">mapping — spreadsheet column index → field</div>
                                <pre class="code-card__body">{{ JSON.stringify(mappingResult.mapping, null, 2) }}</pre>
                            </div>
                        </template>

                        <!-- transform -->
                        <template v-else-if="transformedResult">
                            <div class="out-note">
                                <code>:transform</code> — {{ transformedResult.length }} rows ready to POST to your API.
                            </div>
                            <div class="code-card">
                                <div class="code-card__head">First 3 rows</div>
                                <pre class="code-card__body">{{ JSON.stringify(transformedResult.slice(0, 3), null, 2) }}</pre>
                            </div>
                        </template>

                        <!-- rows -->
                        <template v-else-if="result">
                            <div class="out-note">
                                <code>MappedResult[]</code> — {{ result.length }} columns mapped.
                            </div>
                            <div class="out-cols">
                                <div v-for="col in result" :key="col.field" class="out-col">
                                    <code class="out-col__field">{{ col.field }}</code>
                                    <span class="out-col__from">← «{{ col.columnName }}»</span>
                                    <span class="out-col__rows">{{ col.data.length }} filas</span>
                                </div>
                            </div>
                            <div class="code-card">
                                <div class="code-card__head">Data preview</div>
                                <pre class="code-card__body">{{ resultPreview }}</pre>
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
import { computed, onMounted, ref, watch } from 'vue';
import { SheetMapper, IconUpload, IconFile, IconCheck, IconBan, IconAlert } from '../src/index';
import type {
    MappedResult, MappingOutput, SchemaField, Locale, Icons,
    MessagesOverride, MatcherFn, TransformFn, SheetMapperError,
} from '../src/types';

import { version } from '../package.json';
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

const locale = ref<Locale>('en');
const fieldsSource = ref<'immediate' | 'api'>('immediate');
const useCustomIcons = ref(false);
const useCustomMessages = ref(false);
const useCustomMatcher = ref(false);
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

const tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
    { id: 'output', label: 'Output' },
] as const;

const tab = ref<(typeof tabs)[number]['id']>('preview');
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
    if (fieldsSource.value === 'api') loadSchemaFromApi();
});

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
    () => Number(locale.value !== 'en') + Number(useCustomIcons.value) + Number(useCustomMessages.value),
);
const behaviorBadge = computed(
    () => Number(useCustomMatcher.value) + Number(autoIgnore.value) + Number(autoConfirm.value)
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
    if (useCustomMatcher.value) lines.push('  :matcher="positionalMatcher"');
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

const matcherSnippet = `const positional: MatcherFn = (cols, f) => {
  const map = new Map<number, string>();
  cols.forEach((_, i) => {
    if (f[i]) map.set(i, f[i].key);
  });
  return map;
};

// The Map keys are positions in the
// \`columns\` array, not col.index.`;

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
    locale.value = 'en';
    fieldsSource.value = 'immediate';
    useCustomIcons.value = false;
    useCustomMessages.value = false;
    useCustomMatcher.value = false;
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
    --d-accent: #4f46e5;
    --d-accent-soft: #eef2ff;
    --d-hover: #f7f8fa;
    --d-code-bg: #1e1e2e;
    --d-code-fg: #cdd6f4;
    --d-topbar: #16181d;
    --d-sidebar-w: 332px;
    --d-topbar-h: 52px;
    --d-tabs-h: 48px;
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
    background: var(--d-topbar);
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
    color: #a5b4fc;
    background: rgba(99, 102, 241, 0.18);
    padding: 3px 7px;
    border-radius: 4px;
}

.topbar__right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.topbar__version {
    font-size: 12px;
    color: #98a2b3;
    font-variant-numeric: tabular-nums;
}

.topbar__link {
    font-size: 13px;
    color: #d0d5dd;
    text-decoration: none;
    padding: 6px 10px;
    border-radius: 6px;
}

.topbar__link:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

.topbar__link--solid {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

/* ─── Layout ──────────────────────────────────────────────────────────── */

.body {
    flex: 1;
    display: flex;
    min-height: 0;
}

.sidebar {
    width: var(--d-sidebar-w);
    flex-shrink: 0;
    background: var(--d-surface);
    border-right: 1px solid var(--d-line);
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
    background: var(--d-surface);
    color: var(--d-text);
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.08);
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

.snippet {
    margin: 0;
    background: var(--d-code-bg);
    color: var(--d-code-fg);
    border-radius: 8px;
    padding: 11px 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10px;
    line-height: 1.65;
    /* Wrap instead of clipping: the sidebar is narrow and a cut-off
       snippet reads as broken code. Lines are kept short enough that
       this rarely triggers. */
    white-space: pre-wrap;
    overflow-wrap: break-word;
}

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

.code-card__body {
    margin: 0;
    background: var(--d-code-bg);
    color: var(--d-code-fg);
    padding: 16px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    line-height: 1.65;
    overflow-x: auto;
    white-space: pre;
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
    background: var(--d-topbar);
    border: 1px solid #2c3038;
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
    .app { height: auto; overflow: visible; }
    .body { flex-direction: column; }
    .sidebar { width: 100%; border-right: 0; border-bottom: 1px solid var(--d-line); }
    .sidebar__scroll { overflow-y: visible; }
    .canvas { overflow-y: visible; }
    .canvas__inner { padding: 16px; }
}
</style>
