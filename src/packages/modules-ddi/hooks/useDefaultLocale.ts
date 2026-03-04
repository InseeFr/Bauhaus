import { useAppContext } from "../../application/app-context";

/**
 * Custom hook to retrieve the default locale from application properties.
 * Returns the first locale from colecticaLangs array, or "fr-FR" as fallback.
 *
 * @returns The default locale string (e.g., "fr-FR", "en-GB")
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const defaultLocale = useDefaultLocale();
 *   // Use defaultLocale in your component
 * };
 * ```
 */
export const useDefaultLocale = (): string => {
  const { properties } = useAppContext();
  return properties.colecticaLangs?.[0] || "fr-FR";
};
