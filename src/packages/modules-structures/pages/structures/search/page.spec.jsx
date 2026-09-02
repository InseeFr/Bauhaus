import { waitFor } from "@testing-library/react";

import { getListItems } from "@components/ui/list-group/testing";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { renderWithRouter } from "../../../../tests/render";
import { Component } from "./page";

vi.mock("@utils/hooks/useUrlQueryParameters");

vi.mock("@sdk/index", () => ({
  StructureApi: {
    getStructuresForSearch: vi.fn(),
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

const ORGANIZATION_IRI = "http://bauhaus/organizations/insee/HIE2000001";

const data = [
  {
    id: "dsd1000",
    labelLg1: "test",
    creator: ORGANIZATION_IRI,
    components: [],
    validationState: "Unpublished",
  },
  {
    id: "dsd1001",
    labelLg1: "another",
    creator: "http://bauhaus/organizations/insee/OTHER",
    components: [{ labelLg1: "foo", type: "ATTRIBUTE", concept: "c1" }],
    validationState: "Validated",
  },
  {
    id: "dsd1002",
    labelLg1: "third",
    creator: ORGANIZATION_IRI,
    components: [{ labelLg1: "bar", type: "MEASURE", concept: "c2" }],
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
    expect(result.container.querySelector(".structure-search-form")).not.toBeNull();
  });
  return result;
};

describe("<SearchFormList /> structure-search", () => {
  beforeEach(() => {
    StructureApi.getStructuresForSearch.mockResolvedValue(data);
    ConceptsApi.getConceptList.mockResolvedValue([]);
  });

  it("returns all data when the form is empty (including structures with no components)", async () => {
    const { container } = await renderPage({});
    expect(getListItems(container)).toHaveLength(3);
  });

  it("filters by labelLg1", async () => {
    const { container } = await renderPage({ labelLg1: "test" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("filters by creator (organization IRI)", async () => {
    const { container } = await renderPage({ creator: ORGANIZATION_IRI });
    expect(getListItems(container)).toHaveLength(2);
  });

  it("filters by validation state", async () => {
    const { container } = await renderPage({ validationState: "Unpublished" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("filters by component label", async () => {
    const { container } = await renderPage({ componentLabelLg1: "foo" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("filters by component type", async () => {
    const { container } = await renderPage({ type: "MEASURE" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("renders the CreatorsInput (not a stamp dropdown) for the creator filter", async () => {
    const { getByTestId } = await renderPage({ creator: ORGANIZATION_IRI });
    expect(getByTestId("creators-input")).toHaveValue(ORGANIZATION_IRI);
  });
});
