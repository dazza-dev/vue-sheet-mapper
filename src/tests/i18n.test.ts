import { describe, it, expect } from 'vitest';
import { getMessages } from '../i18n';
import type { Locale } from '../types';

const LOCALES: Locale[] = ['en', 'es', 'fr', 'pt', 'nl'];

describe('getMessages', () => {
    it('returns English strings for locale "en"', () => {
        const msgs = getMessages('en');
        expect(msgs.confirm).toBe('Confirm');
        expect(msgs.dropzone.button).toBe('Choose a file');
    });

    it('returns Spanish strings for locale "es"', () => {
        const msgs = getMessages('es');
        expect(msgs.dropzone.title).toBe('Sube un archivo para importar');
    });

    it('returns French strings for locale "fr"', () => {
        const msgs = getMessages('fr');
        expect(msgs.errors.title).toBe('Erreur');
    });

    it('returns Portuguese strings for locale "pt"', () => {
        const msgs = getMessages('pt');
        expect(msgs.columns.ignoreOption).toBe('Ignorar');
    });

    it('returns Dutch strings for locale "nl"', () => {
        const msgs = getMessages('nl');
        expect(msgs.columns.columnFallback).toBe('Kolom {n}');
    });

    it('merges dropzone overrides without affecting other keys', () => {
        const msgs = getMessages('en', {
            dropzone: { title: 'Upload your contacts' },
        });
        expect(msgs.dropzone.title).toBe('Upload your contacts');
        expect(msgs.dropzone.button).toBe('Choose a file'); // unchanged
        expect(msgs.confirm).toBe('Confirm');               // unchanged
    });

    it('merges confirm override', () => {
        const msgs = getMessages('es', { confirm: 'Importar' });
        expect(msgs.confirm).toBe('Importar');
        expect(msgs.dropzone.title).toBe('Sube un archivo para importar'); // unchanged
    });

    it('merges error overrides partially', () => {
        const msgs = getMessages('en', {
            errors: { title: 'Oops' },
        });
        expect(msgs.errors.title).toBe('Oops');
        expect(msgs.errors.noFile).toBe('Please select a file first.'); // unchanged
    });

    it('returns base locale when no overrides are passed', () => {
        const withoutOverrides = getMessages('en');
        const withUndefined = getMessages('en', undefined);
        expect(withoutOverrides).toBe(withUndefined); // same reference
    });

    // ─── Placeholder completeness across all locales ──────────────────────────

    it('all locales have columnFallback with {n} placeholder', () => {
        for (const locale of LOCALES) {
            expect(getMessages(locale).columns.columnFallback, locale).toContain('{n}');
        }
    });

    it('all locales have fileTooLarge with {size} placeholder', () => {
        for (const locale of LOCALES) {
            expect(getMessages(locale).errors.fileTooLarge, locale).toContain('{size}');
        }
    });

    it('all locales have tooManyRows with {max} placeholder', () => {
        for (const locale of LOCALES) {
            expect(getMessages(locale).errors.tooManyRows, locale).toContain('{max}');
        }
    });

    // ─── Non-empty string completeness ───────────────────────────────────────

    it('all locales have non-empty dismiss and loading strings', () => {
        for (const locale of LOCALES) {
            const msgs = getMessages(locale);
            expect(msgs.errors.dismiss, `${locale} dismiss`).toBeTruthy();
            expect(msgs.loading, `${locale} loading`).toBeTruthy();
        }
    });

    it('all locales have non-empty core strings', () => {
        for (const locale of LOCALES) {
            const msgs = getMessages(locale);
            expect(msgs.confirm, `${locale} confirm`).toBeTruthy();
            expect(msgs.dropzone.title, `${locale} dropzone.title`).toBeTruthy();
            expect(msgs.dropzone.button, `${locale} dropzone.button`).toBeTruthy();
            expect(msgs.errors.title, `${locale} errors.title`).toBeTruthy();
            expect(msgs.errors.invalidFileType, `${locale} errors.invalidFileType`).toBeTruthy();
            expect(msgs.columns.unassigned, `${locale} columns.unassigned`).toBeTruthy();
            expect(msgs.columns.selectPlaceholder, `${locale} columns.selectPlaceholder`).toBeTruthy();
        }
    });
});
