<template>
    <div class="demo">
        <header class="demo-header">
            <h1>vue-sheet-mapper <span>demo</span></h1>
            <div class="demo-controls">
                <div class="demo-control">
                    <label>Locale</label>
                    <select v-model="locale">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="pt">Português</option>
                        <option value="nl">Nederlands</option>
                    </select>
                </div>
                <div class="demo-control">
                    <label>Icons</label>
                    <div class="demo-toggle">
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': !useCustomIcons }]"
                            @click="useCustomIcons = false"
                        >Default</button>
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': useCustomIcons }]"
                            @click="useCustomIcons = true"
                        >Custom (filled)</button>
                    </div>
                </div>
                <div class="demo-control">
                    <label>Messages</label>
                    <div class="demo-toggle">
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': !useCustomMessages }]"
                            @click="useCustomMessages = false"
                        >Default</button>
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': useCustomMessages }]"
                            @click="useCustomMessages = true"
                        >Custom</button>
                    </div>
                </div>
                <div class="demo-control">
                    <label>Matcher</label>
                    <div class="demo-toggle">
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': !useCustomMatcher }]"
                            @click="useCustomMatcher = false"
                        >Auto (label)</button>
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': useCustomMatcher }]"
                            @click="useCustomMatcher = true"
                        >Custom (positional)</button>
                    </div>
                </div>
                <div class="demo-control">
                    <label>Auto-ignore</label>
                    <div class="demo-toggle">
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': !autoIgnore }]"
                            @click="autoIgnore = false"
                        >Off</button>
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': autoIgnore }]"
                            @click="autoIgnore = true"
                        >On</button>
                    </div>
                </div>
                <div class="demo-control">
                    <label>Auto-confirm</label>
                    <div class="demo-toggle">
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': !autoConfirm }]"
                            @click="autoConfirm = false"
                        >Off</button>
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': autoConfirm }]"
                            @click="autoConfirm = true"
                        >On</button>
                    </div>
                </div>
                <div class="demo-control">
                    <label>Transform</label>
                    <div class="demo-toggle">
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': !useTransform }]"
                            @click="useTransform = false"
                        >Off</button>
                        <button
                            :class="['demo-toggle__btn', { 'demo-toggle__btn--active': useTransform }]"
                            @click="useTransform = true"
                        >On</button>
                    </div>
                </div>
                <div class="demo-control">
                    <label>Max file size</label>
                    <select v-model="maxFileSizeOption">
                        <option value="">No limit</option>
                        <option value="10485760">10 MB</option>
                        <option value="1048576">1 MB</option>
                        <option value="102400">100 KB</option>
                        <option value="10240">10 KB</option>
                    </select>
                </div>
            </div>
        </header>

        <!-- Props usage hint -->
        <div class="demo-hint">
            <code>&lt;SheetMapper
  :fields="fields"
  locale="{{ locale }}"{{ useCustomIcons ? '\n  :icons="customIcons"' : '' }}{{ useCustomMessages ? '\n  :messages="customMessages[locale]"' : '' }}{{ useCustomMatcher ? '\n  :matcher="positionalMatcher"' : '' }}{{ autoIgnore ? '\n  :auto-ignore="true"' : '' }}{{ autoConfirm ? '\n  :auto-confirm="true"' : '' }}{{ useTransform ? '\n  :transform="contactTransform"' : '' }}{{ maxFileSizeOption ? `\n  :max-file-size="${maxFileSizeOption}"` : '' }}
/&gt;</code>
            <div class="demo-hint__notes">
                <span v-if="useCustomIcons" class="demo-hint__note"><code>icons</code> — partial override, only the keys you provide are replaced</span>
                <span v-if="useCustomMessages" class="demo-hint__note"><code>messages</code> — partial override per locale, merged with the built-in base strings</span>
                <span v-if="useCustomMatcher" class="demo-hint__note"><code>matcher</code> — positional: column 1 → field 1, column 2 → field 2, regardless of header names</span>
                <span v-if="autoIgnore" class="demo-hint__note"><code>auto-ignore</code> — unmatched columns are pre-set to "ignore" so the user only handles recognized columns</span>
                <span v-if="autoConfirm" class="demo-hint__note"><code>auto-confirm</code> — if all columns are valid after auto-match, skips the UI and emits @mapped immediately</span>
                <span v-if="useTransform" class="demo-hint__note"><code>transform</code> — converts column data to row objects, cleans whitespace, merges first+last name, normalizes phone</span>
                <span v-if="maxFileSizeOption" class="demo-hint__note"><code>max-file-size</code> — rejects files larger than {{ Number(maxFileSizeOption) >= 1048576 ? (Number(maxFileSizeOption) / 1048576).toFixed(0) + ' MB' : (Number(maxFileSizeOption) / 1024).toFixed(0) + ' KB' }} before parsing</span>
                <span v-if="!useCustomIcons && !useCustomMessages && !useCustomMatcher && !autoIgnore && !autoConfirm && !useTransform && !maxFileSizeOption" class="demo-hint__note">toggle any option above to see the props in action</span>
            </div>
        </div>

        <main class="demo-main">
            <SheetMapper
                :fields="contactFields"
                :locale="locale"
                :preview-rows="4"
                :icons="useCustomIcons ? customIcons : undefined"
                :messages="useCustomMessages ? customMessages[locale] : undefined"
                :matcher="useCustomMatcher ? positionalMatcher : undefined"
                :auto-ignore="autoIgnore"
                :auto-confirm="autoConfirm"
                :transform="useTransform ? contactTransform : undefined"
                :max-file-size="maxFileSizeOption ? Number(maxFileSizeOption) : undefined"
                @mapped="onMapped"
                @error="onError"
                @file-picked="(f) => console.log('file picked:', f.name)"
                @reset="result = null; transformedResult = null"
            />
        </main>

        <!-- Output panel — column-oriented (no transform) -->
        <aside v-if="result" class="demo-result">
            <h2>Mapped output ({{ result.length }} columns)</h2>
            <div v-for="col in result" :key="col.field" class="demo-result__col">
                <strong>{{ col.field }}</strong> ← "{{ col.columnName }}"
                <span class="demo-result__count">({{ col.data.length }} rows)</span>
            </div>
            <pre class="demo-result__json">{{ JSON.stringify(result.map(c => ({ field: c.field, preview: c.data.slice(0, 3) })), null, 2) }}</pre>
        </aside>

        <!-- Output panel — row-oriented (with transform) -->
        <aside v-if="transformedResult" class="demo-result">
            <h2>Transformed output ({{ transformedResult.length }} rows)</h2>
            <p class="demo-result__label">Each item is a plain row object — ready to POST to your API:</p>
            <pre class="demo-result__json">{{ JSON.stringify(transformedResult.slice(0, 3), null, 2) }}</pre>
        </aside>

        <!-- Messages reference -->
        <section class="demo-messages">
            <h3>Custom messages pattern</h3>
            <p class="demo-messages__desc">
                Pass a <code>Partial&lt;Messages&gt;</code> per locale. Only the keys you provide are overridden —
                the rest falls back to the built-in locale strings.
            </p>
            <pre class="demo-messages__code">{{ messagesSnippet }}</pre>
        </section>

        <!-- Transform reference -->
        <section class="demo-messages">
            <h3>Transform pattern</h3>
            <p class="demo-messages__desc">
                Pass a <code>transform</code> function to convert column data into row objects before <code>@mapped</code> fires.
                Return <code>null</code> to exclude a row. Import <code>toRows</code> if you need the conversion without a transform.
            </p>
            <pre class="demo-messages__code">{{ transformSnippet }}</pre>
        </section>

        <!-- Matcher reference -->
        <section class="demo-messages">
            <h3>Custom matcher pattern</h3>
            <p class="demo-messages__desc">
                Pass a <code>matcher</code> function to replace the built-in label-based auto-match.
                Receives the parsed columns and your schema fields; returns a <code>Map&lt;columnIndex, fieldKey&gt;</code>.
                Import <code>autoMatch</code> from the package to compose with the default.
            </p>
            <pre class="demo-messages__code">{{ matcherSnippet }}</pre>
        </section>

        <!-- Icons reference -->
        <section class="demo-icons">
            <h3>Available icon overrides</h3>
            <div class="demo-icons__grid">
                <div v-for="entry in iconPreview" :key="entry.key" class="demo-icons__item">
                    <div class="demo-icons__pair">
                        <div class="demo-icons__col">
                            <span class="demo-icons__tag">default</span>
                            <component :is="entry.default" width="22" height="22" class="demo-icons__svg" />
                        </div>
                        <div class="demo-icons__arrow">→</div>
                        <div class="demo-icons__col">
                            <span class="demo-icons__tag demo-icons__tag--custom">custom</span>
                            <component :is="entry.custom" width="22" height="22" class="demo-icons__svg demo-icons__svg--custom" />
                        </div>
                    </div>
                    <code class="demo-icons__key">{{ entry.key }}</code>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SheetMapper, IconUpload, IconFile, IconCheck, IconBan, IconAlert } from '../src/index';
import type { MappedResult, MappingOutput, SchemaField, Locale, Icons, MessagesOverride, MatcherFn, TransformFn } from '../src/types';

// Custom icon set — filled/solid style as a contrast to the default outlined icons
import UploadFilledIcon from './icons/UploadFilledIcon.vue';
import FileFilledIcon from './icons/FileFilledIcon.vue';
import CheckCircleFilledIcon from './icons/CheckCircleFilledIcon.vue';
import TriangleAlertIcon from './icons/TriangleAlertIcon.vue';
import BanFilledIcon from './icons/BanFilledIcon.vue';

const locale = ref<Locale>('es');
const result = ref<MappedResult[] | null>(null);
const transformedResult = ref<Record<string, string>[] | null>(null);
const useCustomIcons = ref(false);
const useCustomMessages = ref(false);
const useCustomMatcher = ref(false);
const autoIgnore = ref(false);
const autoConfirm = ref(false);
const useTransform = ref(false);
const maxFileSizeOption = ref('');

// Example transform: clean data and reshape to row-oriented output
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
// Useful when the file always arrives in a fixed column order regardless of header names.
const positionalMatcher: MatcherFn = (columns, fields) => {
    const result = new Map<number, string>();
    columns.forEach((_, i) => {
        if (fields[i]) result.set(i, fields[i].key);
    });
    return result;
};

// Per-locale custom messages — only override what you want, the rest comes from the built-in locale
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
        dropzone: {
            title: 'Déposez votre fichier de contacts ici',
            subtitle: 'Formats acceptés : CSV, XLS ou XLSX',
        },
        confirm: 'Importer les contacts',
    },
    pt: {
        dropzone: {
            title: 'Envie seu arquivo de contatos aqui',
            subtitle: 'Formatos aceitos: CSV, XLS ou XLSX',
        },
        confirm: 'Importar contatos',
    },
    nl: {
        dropzone: {
            title: 'Upload hier uw contactenbestand',
            subtitle: 'Ondersteunde formaten: CSV, XLS of XLSX',
        },
        confirm: 'Contacten importeren',
    },
};

// Pass any subset — unspecified keys fall back to the built-in defaults
const customIcons: Icons = {
    upload: UploadFilledIcon,
    file: FileFilledIcon,
    assigned: CheckCircleFilledIcon,
    ignored: BanFilledIcon,
    unassigned: TriangleAlertIcon,
    confirm: CheckCircleFilledIcon,
};

// Shown in the reference section at the bottom
const iconPreview = [
    { key: 'upload',    default: IconUpload, custom: UploadFilledIcon },
    { key: 'file',      default: IconFile,   custom: FileFilledIcon },
    { key: 'assigned',  default: IconCheck,  custom: CheckCircleFilledIcon },
    { key: 'ignored',   default: IconBan,    custom: BanFilledIcon },
    { key: 'unassigned',default: IconAlert,  custom: TriangleAlertIcon },
    { key: 'confirm',   default: IconCheck,  custom: CheckCircleFilledIcon },
];

const contactFields: SchemaField[] = [
    { key: 'document_number', label: 'Cédula',              required: true, aliases: ['cedula', 'documento', 'doc', 'id'] },
    { key: 'first_name',      label: 'Nombres',             required: true, aliases: ['nombre', 'first name', 'nombres'] },
    { key: 'last_name',       label: 'Apellidos',           required: true, aliases: ['apellido', 'last name', 'apellidos'] },
    { key: 'cellphone',       label: 'Celular',                             aliases: ['telefono', 'phone', 'cel'] },
    { key: 'email',           label: 'Correo',                              aliases: ['email', 'correo electronico', 'mail'] },
    { key: 'gender',          label: 'Género',                              aliases: ['genero', 'sexo', 'gender'] },
    { key: 'birthdate',       label: 'Fecha de nacimiento',                 aliases: ['cumpleanos', 'fecha nacimiento', 'birthdate'] },
    { key: 'role',            label: 'Rol',                                 aliases: ['cargo', 'role'] },
    { key: 'group',           label: 'Grupo',                               aliases: ['grupo', 'group'] },
    { key: 'type_vote',       label: 'Tipo de apoyo',                       aliases: ['tipo voto', 'apoyo', 'vote type'] },
    { key: 'expected',        label: 'Votos esperados',                     aliases: ['votos', 'expected votes'] },
    { key: 'state',           label: 'Departamento',                        aliases: ['department', 'state', 'depto'] },
    { key: 'city',            label: 'Municipio',                           aliases: ['municipality', 'city', 'ciudad'] },
    { key: 'address',         label: 'Dirección',                           aliases: ['address', 'direccion'] },
    { key: 'leader_document', label: 'Cédula Líder',                        aliases: ['cedula lider', 'lider', 'leader'] },
];

const matcherSnippet = `import { autoMatch } from '@dazzadev/vue-sheet-mapper';
import type { MatcherFn } from '@dazzadev/vue-sheet-mapper';

// Example 1 — positional: column 0 → first field, column 1 → second field
const positionalMatcher: MatcherFn = (columns, fields) => {
    const map = new Map<number, string>();
    columns.forEach((_, i) => { if (fields[i]) map.set(i, fields[i].key); });
    return map;
};

// Example 2 — fuzzy: use includes() instead of exact match, fall back to autoMatch
const fuzzyMatcher: MatcherFn = (columns, fields) => {
    const map = new Map<number, string>();
    const used = new Set<string>();
    for (let i = 0; i < columns.length; i++) {
        const norm = columns[i].name.toLowerCase().replace(/\\s+/g, '');
        for (const field of fields) {
            if (used.has(field.key)) continue;
            const candidates = [field.label, ...(field.aliases ?? [])];
            if (candidates.some(c => norm.includes(c.toLowerCase().replace(/\\s+/g, '')))) {
                map.set(i, field.key);
                used.add(field.key);
                break;
            }
        }
    }
    return map;
};

// In the template
<SheetMapper :matcher="positionalMatcher" />`;

const messagesSnippet = `// Define per locale — only override what you need
const customMessages: Partial<Record<Locale, Partial<Messages>>> = {
    es: {
        dropzone: { title: 'Sube aquí tu archivo de contactos' },
        confirm: 'Importar contactos',
    },
    en: {
        dropzone: { title: 'Upload your contacts file here' },
        confirm: 'Import contacts',
    },
    // other locales...
};

// In the template — locale drives both base strings and your overrides
<SheetMapper
    :locale="locale"
    :messages="customMessages[locale]"
/>`;

const transformSnippet = `import type { TransformFn, MappedResult } from '@dazzadev/vue-sheet-mapper';
import { toRows } from '@dazzadev/vue-sheet-mapper';

// Define the output shape — TypeScript will infer it from the return type
const contactTransform: TransformFn<{
    document_number: string;
    full_name: string;
    email: string;
    cellphone: string;
}> = (row) => {
    if (!row.first_name && !row.document_number) return null; // skip empty rows
    return {
        document_number: row.document_number?.trim() ?? '',
        full_name: \`\${row.first_name?.trim()} \${row.last_name?.trim()}\`.trim(),
        email: row.email?.toLowerCase().trim() ?? '',
        cellphone: row.cellphone?.replace(/\\D/g, '') ?? '',
    };
};

// @mapped now emits your custom type instead of MappedResult[]
<SheetMapper :transform="contactTransform" @mapped="onMapped" />

// Without transform — convert manually whenever you need rows
function onMapped(results: MappedResult[]) {
    const rows = toRows(results);
    // [{ first_name: 'Ana', email: 'ana@email.com', ... }, ...]
}`;

function onMapped(data: MappedResult[] | MappingOutput | unknown[]) {
    if (useTransform.value) {
        result.value = null;
        transformedResult.value = data as Record<string, string>[];
    } else {
        transformedResult.value = null;
        result.value = data as MappedResult[];
    }
    console.log('mapped:', data);
}

function onError(err: { code: string; message: string }) {
    console.error('error:', err);
}
</script>

<style>
* { box-sizing: border-box; }

body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background: #f3f4f6;
    color: #111827;
}

.demo {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.demo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

.demo-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
}

.demo-header h1 span {
    font-weight: 400;
    color: #6b7280;
    font-size: 1rem;
}

.demo-controls {
    display: flex;
    align-items: center;
    gap: 20px;
}

.demo-control {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
}

.demo-control label {
    color: #6b7280;
    font-weight: 500;
}

.demo-control select {
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
}

.demo-toggle {
    display: flex;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
}

.demo-toggle__btn {
    padding: 4px 12px;
    background: #fff;
    border: none;
    cursor: pointer;
    font-size: 0.8125rem;
    color: #374151;
    transition: background 0.15s, color 0.15s;
}

.demo-toggle__btn + .demo-toggle__btn {
    border-left: 1px solid #d1d5db;
}

.demo-toggle__btn--active {
    background: #3b82f6;
    color: #fff;
}

.demo-hint {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 12px 16px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    font-size: 0.8125rem;
    flex-wrap: wrap;
}

.demo-hint > code {
    font-family: monospace;
    font-size: 0.8125rem;
    white-space: pre;
    background: #e0f2fe;
    padding: 6px 10px;
    border-radius: 6px;
    line-height: 1.6;
}

.demo-hint__notes {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 6px;
}

.demo-hint__note {
    color: #0369a1;
}

.demo-hint__note code {
    background: #bae6fd;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: monospace;
}

.demo-main {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}

.demo-result {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}

.demo-result h2 {
    margin: 0 0 16px;
    font-size: 1rem;
    font-weight: 600;
}

.demo-result__col {
    padding: 6px 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.875rem;
}

.demo-result__count {
    color: #6b7280;
    margin-left: 6px;
}

.demo-result__label {
    margin: 0 0 12px;
    font-size: 0.875rem;
    color: #4b5563;
}

.demo-result__json {
    margin-top: 16px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 6px;
    font-size: 0.8125rem;
    overflow: auto;
    max-height: 320px;
}

/* Messages reference section */
.demo-messages {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}

.demo-messages h3 {
    margin: 0 0 8px;
    font-size: 0.9375rem;
    font-weight: 600;
}

.demo-messages__desc {
    margin: 0 0 16px;
    font-size: 0.875rem;
    color: #4b5563;
}

.demo-messages__desc code {
    background: #f3f4f6;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.8125rem;
}

.demo-messages__code {
    margin: 0;
    padding: 16px;
    background: #1e293b;
    color: #e2e8f0;
    border-radius: 8px;
    font-size: 0.8125rem;
    font-family: monospace;
    line-height: 1.6;
    overflow: auto;
}

/* Icons reference section */
.demo-icons {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}

.demo-icons h3 {
    margin: 0 0 16px;
    font-size: 0.9375rem;
    font-weight: 600;
}

.demo-icons__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.demo-icons__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 18px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
    min-width: 130px;
}

.demo-icons__pair {
    display: flex;
    align-items: center;
    gap: 10px;
}

.demo-icons__col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.demo-icons__arrow {
    color: #9ca3af;
    font-size: 0.875rem;
}

.demo-icons__tag {
    font-size: 0.6875rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.demo-icons__tag--custom {
    color: #3b82f6;
}

.demo-icons__svg {
    color: #374151;
}

.demo-icons__svg--custom {
    color: #3b82f6;
}

.demo-icons__key {
    font-size: 0.75rem;
    background: #e5e7eb;
    padding: 2px 6px;
    border-radius: 4px;
    color: #374151;
}
</style>
