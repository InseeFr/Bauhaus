import { vi } from "vitest";

/**
 * Fabriques de `vi.mock` pour les pages des listes de codes. Ce module n'importe que
 * `vitest` : il se charge donc sans risque par
 * `const { … } = await vi.hoisted(() => import("<chemin>/testing/pages.testing"))`.
 */

type ImportOriginal = <T>() => Promise<T>;

const withCodelistsApi = async (
  importOriginal: ImportOriginal,
  CodelistsApi: Record<string, unknown>,
) => ({ ...(await importOriginal<Record<string, unknown>>()), CodelistsApi });

/** `@sdk/index` des pages d'une liste de codes complète, enrichi de `extraApi`. */
export const detailedCodelistSdk = (
  importOriginal: ImportOriginal,
  extraApi: Record<string, unknown> = {},
) =>
  withCodelistsApi(importOriginal, {
    getDetailedCodelist: vi.fn(),
    getCodesDetailedCodelist: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
    ...extraApi,
  });

/** `@sdk/index` des pages d'une liste partielle, dont `parent` est la seule liste globale. */
export const partialCodelistSdk = (
  importOriginal: ImportOriginal,
  parent: Record<string, string>,
) =>
  withCodelistsApi(importOriginal, {
    getCodelists: vi.fn(() => Promise.resolve([parent])),
    getCodelistPartial: vi.fn(),
    getCodelistCodes: vi.fn(() => Promise.resolve({ items: [] })),
  });

/** `react-router-dom` dont `useParams` désigne une liste inconnue. */
export const unknownCodelistRouter = async (importOriginal: ImportOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useParams: () => ({ id: "CL_UNKNOWN" }),
});
