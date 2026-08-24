import type { MappedResult } from '../types';

/**
 * Convert column-oriented MappedResult[] into an array of row objects.
 * Each row is a plain object mapping fieldKey → value for that row index.
 */
export function toRows(results: MappedResult[]): Record<string, string>[] {
    if (!results.length) return [];
    const count = results.reduce((max, r) => Math.max(max, (r?.data || []).length), 0);
    return Array.from({ length: count }, (_, i) =>
        Object.fromEntries(results.map((r) => [r.field, r.data[i] ?? ''])),
    );
}
