import { waitFor } from "@testing-library/react";
import { ConceptsApi, StructureApi } from "@sdk/index";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import { renderWithRouter } from "../../../../tests/render";
import { Component } from "./page";
import { getListItems } from "@components/ui/list-group/testing";

vi.mock("@utils/hooks/useUrlQueryParameters");

vi.mock("@sdk/index", () => ({
  StructureApi: {
    getMutualizedComponentsForSearch: vi.fn(),
  },
  ConceptsApi: {
    getConceptList: vi.fn(),
  },
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: ({ value, onChange }) => (
    <input
      data-testid="creators-input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const ORGANISATION_IRI = "http://bauhaus/organisations/insee/HIE2000001";

const data = [
  {
    id: "c1000",
    labelLg1: "test",
    type: "ATTRIBUTE",
    concept: "c1",
    creator: ORGANISATION_IRI,
    validationState: "Unpublished",
  },
  {
    id: "c1001",
    labelLg1: "another",
    type: "MEASURE",
    concept: "c2",
    creator: "http://bauhaus/organisations/insee/OTHER",
    validationState: "Validated",
  },
  {
    id: "c1002",
    labelLg1: "third",
    type: "DIMENSION",
    concept: "c1",
    creator: ORGANISATION_IRI,
    validationState: "Modified",
  },
];

const renderPage = async (form = {}) => {
  useUrlQueryParameters.mockReturnValue({
    form,
    reset: vi.fn(),
    handleChange: vi.fn(),
  });
  const result = renderWithRouter(<Component />);
  await waitFor(() => {
    expect(result.container.querySelector(".component-search-form")).not.toBeNull();
  });
  return result;
};

describe("<SearchFormList /> component-search", () => {
  beforeEach(() => {
    StructureApi.getMutualizedComponentsForSearch.mockResolvedValue(data);
    ConceptsApi.getConceptList.mockResolvedValue([]);
  });

  it("returns all data when the form is empty", async () => {
    const { container } = await renderPage({});
    expect(getListItems(container)).toHaveLength(3);
  });

  it("filters by label", async () => {
    const { container } = await renderPage({ labelLg1: "test" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("filters by creator (organisation IRI)", async () => {
    const { container } = await renderPage({ creator: ORGANISATION_IRI });
    expect(getListItems(container)).toHaveLength(2);
  });

  it("filters by validation state", async () => {
    const { container } = await renderPage({ validationState: "Unpublished" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("renders the CreatorsInput (not a stamp dropdown) for the creator filter", async () => {
    const { getByTestId } = await renderPage({ creator: ORGANISATION_IRI });
    expect(getByTestId("creators-input")).toHaveValue(ORGANISATION_IRI);
  });
});
