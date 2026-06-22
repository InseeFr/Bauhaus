import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import { renderWithRouter } from "../../../../tests/render";
import { SearchFormList } from "./page";

vi.mock("@utils/hooks/useUrlQueryParameters");

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
    id: "cl1000",
    labelLg1: "test",
    creator: ORGANISATION_IRI,
    validationState: "Unpublished",
    codes: [],
  },
  {
    id: "cl1001",
    labelLg1: "another",
    creator: "http://bauhaus/organisations/insee/OTHER",
    validationState: "Validated",
    codes: [],
  },
  {
    id: "cl1002",
    labelLg1: "third",
    creator: ORGANISATION_IRI,
    validationState: "Modified",
    codes: [],
  },
];

const renderForm = (form = {}) => {
  useUrlQueryParameters.mockReturnValue({
    form,
    reset: vi.fn(),
    handleChange: vi.fn(),
  });
  return renderWithRouter(<SearchFormList data={data} />);
};

describe("<SearchFormList /> codelists-search", () => {
  it("returns all data when the form is empty", () => {
    const { container } = renderForm({});
    expect(container.querySelectorAll("li.list-group-item")).toHaveLength(3);
  });

  it("filters by label", () => {
    const { container } = renderForm({ labelLg1: "test" });
    expect(container.querySelectorAll("li.list-group-item")).toHaveLength(1);
  });

  it("filters by creator (organisation IRI)", () => {
    const { container } = renderForm({ creator: ORGANISATION_IRI });
    expect(container.querySelectorAll("li.list-group-item")).toHaveLength(2);
  });

  it("filters by validation state", () => {
    const { container } = renderForm({ validationState: "Unpublished" });
    expect(container.querySelectorAll("li.list-group-item")).toHaveLength(1);
  });

  it("renders the CreatorsInput (not a stamp dropdown) for the creator filter", () => {
    const { getByTestId } = renderForm({ creator: ORGANISATION_IRI });
    expect(getByTestId("creators-input")).toHaveValue(ORGANISATION_IRI);
  });
});
