import { vi } from "vitest";

// Fabriques de mocks destinées aux `vi.mock` hissés : les specs les chargent par un
// `await import(...)` dans la fabrique. Ce module ne doit donc importer aucun module
// susceptible d'être lui-même mocké (react-router, react-i18next, @sdk…).

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

/** Mock de `@sdk/codelists-api` sans aucune donnée. */
export const emptyCodelistsApi = () => ({
  CodelistsApi: {
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
    getPartialsByParent: vi.fn().mockResolvedValue([]),
  },
});

/** Mock de `@sdk/stamps-api` sans aucun timbre. */
export const emptyStampsApi = () => ({
  StampsApi: { getStamps: vi.fn().mockResolvedValue([]) },
});

/** Mock de `@sdk/structure-api` d'une page de recherche avancée : `searchMethod` seul. */
export const searchPageStructureApi = (searchMethod: string) => ({
  StructureApi: {
    [searchMethod]: vi.fn(),
  },
});

/** Mock de `@sdk/concepts-api` d'une page de recherche avancée. */
export const searchPageConceptsApi = () => ({
  ConceptsApi: {
    getConceptList: vi.fn(),
  },
});

export { translationKeysAsLabels } from "../tests/react-i18next.testing";
