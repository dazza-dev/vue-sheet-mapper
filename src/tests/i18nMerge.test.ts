import { describe, it, expect } from 'vitest';
import { getMessages } from '../i18n';

describe('getMessages', () => {
    it('keeps the base string when an override key is explicitly undefined', () => {
        const base = getMessages('es');
        const merged = getMessages('es', { errors: { tooManyRows: undefined } });

        expect(merged.errors.tooManyRows).toBe(base.errors.tooManyRows);
        expect(merged.errors.tooManyRows).not.toBe('');
    });

    it('applies the overrides that do carry a value', () => {
        const merged = getMessages('en', {
            dropzone: { title: 'Drop it here' },
            confirm: 'Import',
        });

        expect(merged.dropzone.title).toBe('Drop it here');
        expect(merged.confirm).toBe('Import');
        expect(merged.dropzone.subtitle).toBe(getMessages('en').dropzone.subtitle);
    });

    it('returns every locale complete, with no undefined strings', () => {
        for (const locale of ['en', 'es', 'fr', 'pt', 'nl'] as const) {
            const m = getMessages(locale);
            const flat = [
                ...Object.values(m.dropzone),
                ...Object.values(m.columns),
                ...Object.values(m.errors),
                m.confirm,
                m.loading,
            ];
            expect(flat.every((v) => typeof v === 'string' && v.length > 0)).toBe(true);
        }
    });
});
