import type { ParsedColumn, SchemaField } from '../types';

function normalize(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // remove accents
        .replace(/[^a-z0-9]/g, '')       // keep only alphanumeric
        .trim();
}

/**
 * For each parsed column, find the best-matching schema field by comparing
 * the column name against field labels and aliases (normalized, exact match).
 * Returns a Map<columnIndex, fieldKey>.
 */
export function autoMatch(columns: ParsedColumn[], fields: SchemaField[]): Map<number, string> {
    const result = new Map<number, string>();
    const usedKeys = new Set<string>();

    for (let i = 0; i < columns.length; i++) {
        const colNorm = normalize(columns[i].name);
        if (!colNorm) continue;

        for (const field of fields) {
            if (usedKeys.has(field.key)) continue;

            const candidates = [field.label, ...(field.aliases ?? [])].map(normalize);
            if (candidates.includes(colNorm)) {
                result.set(i, field.key);
                usedKeys.add(field.key);
                break;
            }
        }
    }

    return result;
}
