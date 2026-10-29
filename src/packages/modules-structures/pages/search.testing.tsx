import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentType, createElement, ReactNode } from "react";
import { Route, Routes } from "react-router";

import { getListItems } from "@components/ui/list-group/testing";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { renderWithQuery } from "../../tests/render-with-query.testing";
import { sdkRejection } from "../../tests/sdk-rejection.testing";

const LIST_PAGE = <p>Liste</p>;

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
const mockSearchForm = (form = {}) =>
  vi.mocked(useUrlQueryParameters).mockReturnValue({
    form,
    setForm: vi.fn(),
    reset: vi.fn(),
    handleChange: vi.fn(),
  });

export const renderSearchPage = async (page: ReactNode, formSelector: string, form = {}) => {
  mockSearchForm(form);
  // `/*` : la page peut déclarer ses propres `<Routes>` (retour à la liste).
  const result = renderWithQuery(page, { path: "/*", route: "/" });
  await waitFor(() => {
    expect(result.container.querySelector(formSelector)).not.toBeNull();
  });
  return result;
};

/** La page suspend tant que les résultats ou les concepts ne sont pas lus, puis échoue dans l'encart du module. */
export const itLoadsTheResultsAndTheConcepts = (Component: ComponentType, searchMethod: string) => {
  it("waits for the results and the concepts, asked at the same time", async () => {
    mockSearchForm();
    (StructureApi as any)[searchMethod].mockReturnValue(new Promise(() => undefined));

    renderWithQuery(createElement(Component));

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(ConceptsApi.getConceptList).toHaveBeenCalledOnce();
  });

  it("shows the module error when the concepts cannot be loaded", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mockSearchForm();
    vi.mocked(ConceptsApi.getConceptList).mockRejectedValue(sdkRejection.emptyBody(500));

    renderWithQuery(createElement(Component));

    expect(await screen.findByText("An error has occurred")).toBeInTheDocument();
  });
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
        <Route path="/" element={createElement(Component)} />
        <Route path={listPath} element={LIST_PAGE} />
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchApi(searchMethod, data);
  });

  itLoadsTheResultsAndTheConcepts(Component, searchMethod);

  itFiltersSearchResults(renderPage, cases);

  itRendersCreatorsInput(renderPage);

  itResetsTheCriteria(renderPage);

  itGoesBackToTheList(Component, formSelector, listPath);
};
