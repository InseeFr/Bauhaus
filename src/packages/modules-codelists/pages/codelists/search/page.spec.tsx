import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ChangeEvent, useCallback } from "react";
import { Route, Routes } from "react-router";
import { Mock } from "vitest";

import { getListItems } from "@components/ui/list-group/testing";

import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { renderWithRouter } from "../../../../tests/render";
import { SearchFormList } from "./page";

vi.mock("@utils/hooks/useUrlQueryParameters");

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: ({ value, onChange }: { value?: string; onChange: (value: string) => void }) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
      [onChange],
    );
    return <input data-testid="creators-input" value={value ?? ""} onChange={handleChange} />;
  },
}));

const ORGANIZATION_IRI = "http://bauhaus/organizations/insee/HIE2000001";

const data = [
  {
    id: "cl1000",
    labelLg1: "test",
    creator: ORGANIZATION_IRI,
    validationState: "Unpublished",
    codes: [],
  },
  {
    id: "cl1001",
    labelLg1: "another",
    creator: "http://bauhaus/organizations/insee/OTHER",
    validationState: "Validated",
    codes: [],
  },
  {
    id: "cl1002",
    labelLg1: "third",
    creator: ORGANIZATION_IRI,
    validationState: "Modified",
    codes: [],
  },
];

const SEARCH_PAGE = <SearchFormList data={data} />;
const CODELISTS_PAGE = <p>Liste des listes de codes</p>;

const renderForm = (form: Record<string, string> = {}) => {
  (useUrlQueryParameters as Mock).mockReturnValue({
    form,
    reset: vi.fn(),
    handleChange: vi.fn(),
  });
  return renderWithRouter(<SearchFormList data={data} />);
};

describe("<SearchFormList /> codelists-search", () => {
  it("returns all data when the form is empty", () => {
    const { container } = renderForm({});
    expect(getListItems(container)).toHaveLength(3);
  });

  it("filters by label", () => {
    const { container } = renderForm({ labelLg1: "test" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("filters by creator (organization IRI)", () => {
    const { container } = renderForm({ creator: ORGANIZATION_IRI });
    expect(getListItems(container)).toHaveLength(2);
  });

  it("filters by validation state", () => {
    const { container } = renderForm({ validationState: "Unpublished" });
    expect(getListItems(container)).toHaveLength(1);
  });

  it("renders the CreatorsInput (not a stamp dropdown) for the creator filter", () => {
    const { getByTestId } = renderForm({ creator: ORGANIZATION_IRI });
    expect(getByTestId("creators-input")).toHaveValue(ORGANIZATION_IRI);
  });
});

describe("codelists advanced search page", () => {
  it("resets the criteria when the reset button is clicked", async () => {
    const reset = vi.fn();
    (useUrlQueryParameters as Mock).mockReturnValue({
      form: { labelLg1: "test" },
      reset,
      handleChange: vi.fn(),
    });
    renderWithRouter(<SearchFormList data={data} />);

    await userEvent.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(reset).toHaveBeenCalledOnce();
  });

  it("goes back to the list of codelists when the back button is clicked", async () => {
    (useUrlQueryParameters as Mock).mockReturnValue({
      form: {},
      reset: vi.fn(),
      handleChange: vi.fn(),
    });
    renderWithRouter(
      <Routes>
        <Route path="/" element={SEARCH_PAGE} />
        <Route path="/codelists" element={CODELISTS_PAGE} />
      </Routes>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByText("Liste des listes de codes")).toBeVisible();
  });
});
