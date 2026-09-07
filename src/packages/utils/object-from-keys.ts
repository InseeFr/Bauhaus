/**
 * Create an empty object with a default value
 */
export default function objectFromKeys<T>(keys: string[], defaultValue: T): Record<string, T> {
  return keys.reduce((obj: Record<string, T>, key: string) => {
    obj[key] = defaultValue;
    return obj;
  }, {});
}
