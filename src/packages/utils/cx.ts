type ClassValue = string | false | null | undefined;

/**
 * Assemble des noms de classes CSS en ignorant les valeurs absentes.
 *
 * Remplace les `` `base ${maybeUndefined}` `` disséminés dans l'application, qui
 * produisent des `class="base undefined"` ou des espaces parasites dès qu'une
 * valeur optionnelle manque.
 *
 * @example
 * cx("row", className)                       // "row" si className est undefined
 * cx("w-100", required && "label-required")  // "w-100" si required est faux
 */
export const cx = (...values: ClassValue[]): string => values.filter(Boolean).join(" ");
