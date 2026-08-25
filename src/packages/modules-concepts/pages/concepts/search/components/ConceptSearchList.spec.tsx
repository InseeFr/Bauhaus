import { screen } from "@testing-library/react";

import { renderWithRouter } from "../../../../../tests/render";
import { ConceptForAdvancedSearch } from "../../../../types/concept";
import AdvancedSearch from "./ConceptSearchList";

let lastCreatorsInputProps: Record<string, unknown> | undefined;

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    isLoading: false,
    data: [],
  }),
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: (props: Record<string, unknown>) => {
    lastCreatorsInputProps = props;
    return <div data-testid="creators-input" />;
  },
}));

const concept = (overrides: Partial<ConceptForAdvancedSearch>): ConceptForAdvancedSearch => ({
  id: "1",
  label: "Concept",
  created: "",
  modified: "",
  disseminationStatus: "",
  validationState: "Unpublished",
  definition: "",
  creator: "",
  isTopConceptOf: "",
  valid: "",
  altLabel: null,
  ...overrides,
});

describe("concepts-advanced-search", () => {
  it("renders without crashing", () => {
    renderWithRouter(<AdvancedSearch conceptSearchList={[]} onExport={vi.fn()} />);
  });

  it("renders a labelled, search-icon input for each free-text criterion", () => {
    const { container } = renderWithRouter(
      <AdvancedSearch conceptSearchList={[]} onExport={vi.fn()} />,
    );

    const searchInputs = container.querySelectorAll(".p-icon-field input.p-inputtext");
    expect(searchInputs).toHaveLength(3);
    searchInputs.forEach((input) => {
      const id = input.getAttribute("id");
      expect(id).toBeTruthy();
      expect(container.querySelector(`label[for="${id}"]`)).not.toBeNull();
    });
  });

  it("lets the user filter creators by organisation (HIE) and not by stamp", () => {
    renderWithRouter(<AdvancedSearch conceptSearchList={[]} onExport={vi.fn()} />);

    expect(screen.getByTestId("creators-input")).toBeInTheDocument();
    expect(lastCreatorsInputProps?.mode).toBe("organisation");
  });

  it("filters concepts on the creator organisation IRI coming from the URL", () => {
    const hieIri = "http://bauhaus/organisations/insee/HIE2000069";
    const concepts = [
      concept({ id: "1", label: "Matching concept", creator: hieIri }),
      concept({
        id: "2",
        label: "Other concept",
        creator: "http://bauhaus/organisations/insee/HIE9999999",
      }),
    ];

    renderWithRouter(<AdvancedSearch conceptSearchList={concepts} onExport={vi.fn()} />, [
      `/?creator=${encodeURIComponent(hieIri)}`,
    ]);

    expect(screen.getByText("Matching concept")).toBeInTheDocument();
    expect(screen.queryByText("Other concept")).not.toBeInTheDocument();
  });
});
