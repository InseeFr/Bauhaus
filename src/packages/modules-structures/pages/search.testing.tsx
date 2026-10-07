import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentType, ReactNode } from "react";
import { Route, Routes } from "react-router";

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

export const itResetsTheCriteria = (renderPage: RenderSearchPage) =>
  it("resets the criteria when the reset button is clicked", async () => {
    await renderPage({ labelLg1: "test" });

    await userEvent.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(vi.mocked(useUrlQueryParameters).mock.results[0].value.reset).toHaveBeenCalledOnce();
  });

export const itGoesBackToTheList = (
  Component: ComponentType,
  formSelector: string,
  listPath: string,
) =>
  it("goes back to the list when the back button is clicked", async () => {
    await renderSearchPage(
      <Routes>
        <Route path="/" element={<Component />} />
        <Route path={listPath} element={<p>Liste</p>} />
      </Routes>,
      formSelector,
    );

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByText("Liste")).toBeVisible();
  });

/**
 * Suite d'une page de recherche avancée : `searchMethod` renvoie `data`, chaque cas de `cases`
 * filtre ces données, le filtre créateur passe par CreatorsInput, le bouton de réinitialisation
 * vide les critères et le bouton de retour ramène à `listPath`. La spec doit mocker
 * `@utils/hooks/useUrlQueryParameters`, `@sdk/index` et `@components/business/creators-input`.
 */
export const itBehavesAsAnAdvancedSearchPage = ({
  Component,
  formSelector,
  searchMethod,
  data,
  cases,
  listPath,
}: {
  Component: ComponentType;
  formSelector: string;
  searchMethod: string;
  data: unknown[];
  cases: SearchFilterCase[];
  listPath: string;
}) => {
  const renderPage: RenderSearchPage = (form) =>
    renderSearchPage(<Component />, formSelector, form);

  beforeEach(() => mockSearchApi(searchMethod, data));

  itFiltersSearchResults(renderPage, cases);

  itRendersCreatorsInput(renderPage);

  itResetsTheCriteria(renderPage);

  itGoesBackToTheList(Component, formSelector, listPath);
};
