import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { vi } from "vitest";

import { getListItems } from "@components/ui/list-group/testing";

import { CodelistsApi } from "@sdk/index";

import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { renderWithRouter } from "../../../../tests/render";
import { Component } from "./page";

vi.mock("@utils/hooks/useUrlQueryParameters");

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodelistsPartialForSearch: vi.fn(),
  },
}));

vi.mock("@utils/hooks/stamps", () => ({
  useStampsOptions: () => [{ value: "DG75-L201", label: "DG75-L201" }],
}));

const ORGANIZATION_IRI = "http://bauhaus/organizations/insee/HIE2000001";

const data = [
  {
    id: "cl1000",
    labelLg1: "Première liste",
    creator: ORGANIZATION_IRI,
    validationState: "Unpublished",
    codes: [{ code: "001", labelLg1: "Premier code" }],
  },
  {
    id: "cl1001",
    labelLg1: "Deuxième liste",
    creator: "http://bauhaus/organizations/insee/OTHER",
    validationState: "Validated",
    codes: [{ code: "002", labelLg1: "Deuxième code" }],
  },
  {
    id: "cl1002",
    labelLg1: "Troisième liste",
    creator: ORGANIZATION_IRI,
    validationState: "Modified",
    codes: [],
  },
];

const renderSearch = async (form = {}) => {
  vi.mocked(useUrlQueryParameters).mockReturnValue({
    form,
    setForm: vi.fn(),
    reset: vi.fn(),
    handleChange: vi.fn(),
  });
  vi.mocked(CodelistsApi.getCodelistsPartialForSearch).mockResolvedValue(data);

  const view = renderWithRouter(<Component />);
  await waitForElementToBeRemoved(() => screen.queryByText(/loading|chargement/i));
  return view;
};

describe("recherche avancée des listes de codes partielles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche toutes les listes quand le formulaire est vide", async () => {
    const { container } = await renderSearch();

    expect(CodelistsApi.getCodelistsPartialForSearch).toHaveBeenCalled();
    expect(getListItems(container)).toHaveLength(3);
  });

  it("filtre par identifiant", async () => {
    const { container } = await renderSearch({ id: "cl1001" });

    expect(getListItems(container)).toHaveLength(1);
  });

  it("filtre par libellé", async () => {
    const { container } = await renderSearch({ labelLg1: "Première" });

    expect(getListItems(container)).toHaveLength(1);
  });

  it("filtre par code contenu dans la liste", async () => {
    const { container } = await renderSearch({ code: "002" });

    expect(getListItems(container)).toHaveLength(1);
  });

  it("filtre par libellé de code contenu dans la liste", async () => {
    const { container } = await renderSearch({ codeLabel: "Premier code" });

    expect(getListItems(container)).toHaveLength(1);
  });

  it("filtre par propriétaire", async () => {
    const { container } = await renderSearch({ creator: ORGANIZATION_IRI });

    expect(getListItems(container)).toHaveLength(2);
  });

  it("filtre par statut de publication", async () => {
    const { container } = await renderSearch({ validationState: "Validated" });

    expect(getListItems(container)).toHaveLength(1);
  });

  it("pointe vers la fiche de la liste partielle", async () => {
    await renderSearch({ id: "cl1000" });

    expect(screen.getByRole("link", { name: /Première liste/ })).toHaveAttribute(
      "href",
      "/codelists/partial/cl1000",
    );
  });
});
