import type { App } from 'vue';
import SheetMapper from './components/SheetMapper.vue';

export { SheetMapper };
export { useSheetMapper } from './composables/useSheetMapper';
export type { UseSheetMapperOptions, UseSheetMapperReturn } from './composables/useSheetMapper';
export { parseFile } from './utils/parseFile';
export { autoMatch } from './utils/autoMatch';
export { toRows } from './utils/toRows';
export { getMessages } from './i18n';

// Icon components — re-exported so users can reference defaults when partially overriding
export { default as IconUpload } from './icons/IconUpload.vue';
export { default as IconFile } from './icons/IconFile.vue';
export { default as IconCheck } from './icons/IconCheck.vue';
export { default as IconBan } from './icons/IconBan.vue';
export { default as IconAlert } from './icons/IconAlert.vue';
export { default as IconSpinner } from './icons/IconSpinner.vue';

export type {
    SchemaField,
    ParsedColumn,
    ColumnState,
    MappedResult,
    SheetMapperError,
    SheetMapperErrorCode,
    Messages,
    MessagesOverride,
    Locale,
    Icons,
    MatcherFn,
    TransformFn,
} from './types';

export const VueSheetMapperPlugin = {
    install(app: App) {
        app.component('SheetMapper', SheetMapper);
    },
};
