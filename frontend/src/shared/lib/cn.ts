/** Joins class names, skipping falsy entries. */
export const cn = (...names: readonly (string | false | null | undefined)[]): string => names.filter(Boolean).join(' ');
