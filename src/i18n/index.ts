import type { Messages, MessagesOverride, Locale } from '../types';
import en from './en';
import es from './es';
import fr from './fr';
import pt from './pt';
import nl from './nl';

const locales: Record<Locale, Messages> = { en, es, fr, pt, nl };

/** Drops keys whose value is undefined, so an explicit undefined in an override
 *  cannot blank out the base string when spread over it. */
function defined<T extends object>(over?: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(over ?? {}).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
}

export function getMessages(locale: Locale, overrides?: MessagesOverride): Messages {
    const base = locales[locale];
    if (!overrides) return base;
    return {
        dropzone: { ...base.dropzone, ...defined(overrides.dropzone) },
        columns: { ...base.columns, ...defined(overrides.columns) },
        confirm: overrides.confirm ?? base.confirm,
        issues: { ...base.issues, ...defined(overrides.issues) },
        loading: overrides.loading ?? base.loading,
        errors: { ...base.errors, ...defined(overrides.errors) },
    };
}
