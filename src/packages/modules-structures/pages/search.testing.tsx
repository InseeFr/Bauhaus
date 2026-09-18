import { waitFor } from "@testing-library/react";
import { ComponentType, ReactNode } from "react";

import { getListItems } from "@components/ui/list-group/testing";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { renderWithRouter } from "../../tests/render";

export const ORGANIZATION_IRI = "https://bauhaus/organizations/insee/HIE2000001";
export const OTHER_ORGANIZATION_IRI = "https://bauhaus/organizations/insee/OTHER";

/** Résultats de recherche renvoyés par `StructureApi[searchMethod]`, sans concept (la spec doit mocker `@sdk/index`). */
export const mockSearchApi = (searchMethod: string, results: unknown[]) => {
  (StructureApi as any)[searchMethod].mockResolvedValue(results);
  vi.mocked(ConceptsApi.getConceptList).mockResolvedValue([]);
};

/**
 * Rend une page de recherche avancée avec le formulaire `form` (la spec doit mocker
 * `@utils/hooks/useUrlQueryParameters`) et attend l'affichage du formulaire `formSelector`.
 */
export const renderSearchPage = async (page: ReactNode, formSelector: string, form = {}) => {
  vi.mocked(useUrlQueryParameters).mockReturnValue({
    form,
    setForm: vi.fn(),
    reset: vi.fn(),
    handleChange: vi.fn(),
  });
  const result = renderWithRouter(page);
  await waitFor(() => {
    expect(result.container.querySelector(formSelector)).not.toBeNull();
  });
  return result;
};

type RenderSearchPage = (form: Record<string, unknown>) => ReturnType<typeof renderSearchPage>;

interface SearchFilterCase {
  name: string;
  form: Record<string, unknown>;
  expected: number;
}

/** Filtres communs aux recherches avancées, sur des données où 2 éléments sur 3 relèvent de ORGANIZATION_IRI. */
export const creatorAndValidationStateCases: SearchFilterCase[] = [
  {
    name: "filters by creator (organization IRI)",
    form: { creator: ORGANIZATION_IRI },
    expected: 2,
  },
  { name: "filters by validation state", form: { validationState: "Unpublished" }, expected: 1 },
];

/**
 * Un test par cas : la recherche avec `form` affiche `expected` résultats. Pas de `it.each`
 * et de `$name` : Vitest tronque à 40 caractères les valeurs interpolées dans le titre.
 */
export const itFiltersSearchResults = (renderPage: RenderSearchPage, cases: SearchFilterCase[]) =>
  cases.forEach(({ name, form, expected }) =>
    it(name, async () => {
      const { container } = await renderPage(form);
      expect(getListItems(container)).toHaveLength(expected);
    }),
  );

export const itRendersCreatorsInput = (renderPage: RenderSearchPage) =>
  it("renders the CreatorsInput (not a stamp dropdown) for the creator filter", async () => {
    const { getByTestId } = await renderPage({ creator: ORGANIZATION_IRI });
    expect(getByTestId("creators-input")).toHaveValue(ORGANIZATION_IRI);
  });

/**
 * Suite d'une page de recherche avancée : `searchMethod` renvoie `data`, chaque cas de `cases`
 * filtre ces données, puis le filtre créateur passe par CreatorsInput. La spec doit mocker
 * `@utils/hooks/useUrlQueryParameters`, `@sdk/index` et `@components/business/creators-input`.
 */
export const itBehavesAsAnAdvancedSearchPage = ({
  Component,
  formSelector,
  searchMethod,
  data,
  cases,
}: {
  Component: ComponentType;
  formSelector: string;
  searchMethod: string;
  data: unknown[];
  cases: SearchFilterCase[];
}) => {
  const renderPage: RenderSearchPage = (form) =>
    renderSearchPage(<Component />, formSelector, form);

  beforeEach(() => mockSearchApi(searchMethod, data));

  itFiltersSearchResults(renderPage, cases);

  itRendersCreatorsInput(renderPage);
};
