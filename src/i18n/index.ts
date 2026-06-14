import type { Messages, MessagesOverride, Locale } from '../types';
import en from './en';
import es from './es';
import fr from './fr';
import pt from './pt';
import nl from './nl';

const locales: Record<Locale, Messages> = { en, es, fr, pt, nl };

export function getMessages(locale: Locale, overrides?: MessagesOverride): Messages {
    const base = locales[locale] ?? locales.en;
    if (!overrides) return base;
    return {
        dropzone: { ...base.dropzone, ...overrides.dropzone },
        columns: { ...base.columns, ...overrides.columns },
        confirm: overrides.confirm ?? base.confirm,
        loading: overrides.loading ?? base.loading,
        errors: { ...base.errors, ...overrides.errors },
    };
}
