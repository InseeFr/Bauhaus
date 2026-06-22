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
    id: "dsd1000",
    labelLg1: "test",
    creator: ORGANISATION_IRI,
    components: [],
    validationState: "Unpublished",
  },
  {
    id: "dsd1001",
    labelLg1: "another",
    creator: "http://bauhaus/organisations/insee/OTHER",
    components: [{ labelLg1: "foo", type: "ATTRIBUTE", concept: "c1" }],
    validationState: "Validated",
  },
  {
    id: "dsd1002",
    labelLg1: "third",
    creator: ORGANISATION_IRI,
    components: [{ labelLg1: "bar", type: "MEASURE", concept: "c2" }],
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

describe("<SearchFormList /> structure-search", () => {
  it("returns all data when the form is empty (including structures with no components)", () => {
    const { container } = renderForm({});
    expect(container.querySelectorAll("li.list-group-item")).toHaveLength(3);
  });

  it("filters by labelLg1", () => {
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

  it("filters by component label", () => {
    const { container } = renderForm({ componentLabelLg1: "foo" });
    expect(container.querySelectorAll("li.list-group-item")).toHaveLength(1);
  });

  it("filters by component type", () => {
    const { container } = renderForm({ type: "MEASURE" });
    expect(container.querySelectorAll("li.list-group-item")).toHaveLength(1);
  });

  it("renders the CreatorsInput (not a stamp dropdown) for the creator filter", () => {
    const { getByTestId } = renderForm({ creator: ORGANISATION_IRI });
    expect(getByTestId("creators-input")).toHaveValue(ORGANISATION_IRI);
  });
});
