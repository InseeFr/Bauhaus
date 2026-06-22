import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import { renderWithRouter } from "../../../tests/render";
import { SearchFormList } from "./search";

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

const renderForm = (form = {}) => {
  useUrlQueryParameters.mockReturnValue({
    form,
    reset: vi.fn(),
    handleChange: vi.fn(),
  });
  return renderWithRouter(<SearchFormList data={data} concepts={[]} />);
};

describe("<SearchFormList /> component-search", () => {
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
