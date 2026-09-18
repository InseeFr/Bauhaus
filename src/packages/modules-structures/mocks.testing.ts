import { vi } from "vitest";

// Fabriques de mocks destinées aux `vi.mock` hissés : les specs les chargent par un
// `await import(...)` dans la fabrique. Ce module ne doit donc importer aucun module
// susceptible d'être lui-même mocké (react-router-dom, react-i18next, @sdk…).

/** Mock de `@utils/hooks/users` : droit de création pour toutes les ressources de `application`. */
export const usersHookWithCreatePrivilege = (
  actual: Record<string, unknown>,
  application: string,
) => ({
  ...actual,
  usePrivileges: () => ({
    privileges: [
      {
        application,
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ],
  }),
  useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
});

/** API `@sdk/index` des listes de codes et des timbres, sans aucune donnée. */
export const emptyCodelistsAndStampsApi = () => ({
  CodelistsApi: {
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
    getPartialsByParent: vi.fn().mockResolvedValue([]),
  },
  StampsApi: { getStamps: vi.fn().mockResolvedValue([]) },
});

/** API `@sdk/index` d'une page de recherche avancée : `searchMethod` de StructureApi et les concepts. */
export const searchPageApi = (searchMethod: string) => ({
  StructureApi: {
    [searchMethod]: vi.fn(),
  },
  ConceptsApi: {
    getConceptList: vi.fn(),
  },
});

export { translationKeysAsLabels } from "../tests/react-i18next.testing";
