import type { ParsedColumn, SchemaField } from '../types';

function normalize(s: string): string {
    return (s || '')
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9]/g, '')       // keep only alphanumeric
        .trim();
}

/**
 * For each parsed column, find the best-matching schema field by comparing
 * the column name against field keys, labels and aliases (normalized, exact match).
 * Returns a Map<columnIndex, fieldKey>.
 */
export function autoMatch(
    columns: ParsedColumn[],
    fields: SchemaField[]
): Map<number, string> {
    const result = new Map<number, string>();
    const usedKeys = new Set<string>();

    const safeCols = Array.isArray(columns) ? columns : [];
    const safeFields: SchemaField[] = Array.isArray(fields)
        ? fields
        : Array.isArray((fields as any)?.value)
          ? (fields as any).value
          : [];

    for (let i = 0; i < safeCols.length; i++) {
        const colName = safeCols[i]?.name;
        const colNorm = normalize(colName);
        if (!colNorm) continue;

        for (const field of safeFields) {
            if (!field || typeof field !== 'object' || !field.key || usedKeys.has(field.key)) continue;

            const aliases = Array.isArray(field.aliases) ? field.aliases : [];
            const candidates = [field.key, field.label, ...aliases]
                .map(normalize)
                .filter(Boolean);

            if (candidates.includes(colNorm)) {
                result.set(i, field.key);
                usedKeys.add(field.key);
                break;
            }
        }
    }

    return result;
}
