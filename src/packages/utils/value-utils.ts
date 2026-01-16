/**
 * Checks if a value is considered empty.
 * Returns true for:
 * - null or undefined
 * - empty string
 * - empty array
 * - array containing only empty values
 *
 * @param value - The value to check
 * @returns true if the value is empty, false otherwise
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.every((item) => isEmpty(item));
  }

  return false;
};
