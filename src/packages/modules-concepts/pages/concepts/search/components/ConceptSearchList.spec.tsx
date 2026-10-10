import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Route, Routes } from "react-router";

import { renderWithRouter } from "../../../../../tests/render";
import { ConceptForAdvancedSearch } from "../../../../types/concept";
import { ConceptSearchList as AdvancedSearch } from "./ConceptSearchList";

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

const NO_CONCEPTS: ConceptForAdvancedSearch[] = [];

const renderSearch = (
  conceptSearchList: ConceptForAdvancedSearch[] = NO_CONCEPTS,
  initialEntries?: string[],
) =>
  renderWithRouter(
    <AdvancedSearch conceptSearchList={conceptSearchList} onExport={vi.fn()} />,
    initialEntries,
  );

const SEARCH_PAGE = <AdvancedSearch conceptSearchList={NO_CONCEPTS} onExport={vi.fn()} />;
const CONCEPTS_LIST_PAGE = <p>Liste des concepts</p>;

describe("concepts-advanced-search", () => {
  it("renders without crashing", () => {
    renderSearch();
  });

  it("titles the document with the module name first, then Advanced search", () => {
    renderSearch();

    expect(document.title).toBe("Concepts - Advanced search - Bauhaus");
  });

  it("renders a labelled, search-icon input for each free-text criterion", () => {
    const { container } = renderSearch();

    const searchInputs = container.querySelectorAll(".p-icon-field input.p-inputtext");
    expect(searchInputs).toHaveLength(3);
    searchInputs.forEach((input) => {
      const id = input.getAttribute("id");
      expect(id).toBeTruthy();
      expect(container.querySelector(`label[for="${id}"]`)).not.toBeNull();
    });
  });

  it("lets the user filter creators by organization (HIE) and not by stamp", () => {
    renderSearch();

    expect(screen.getByTestId("creators-input")).toBeInTheDocument();
    expect(lastCreatorsInputProps?.mode).toBe("organization");
  });

  it("filters concepts on the creator organization IRI coming from the URL", () => {
    const hieIri = "http://bauhaus/organizations/insee/HIE2000069";
    const concepts = [
      concept({ id: "1", label: "Matching concept", creator: hieIri }),
      concept({
        id: "2",
        label: "Other concept",
        creator: "http://bauhaus/organizations/insee/HIE9999999",
      }),
    ];

    renderSearch(concepts, [`/?creator=${encodeURIComponent(hieIri)}`]);

    expect(screen.getByText("Matching concept")).toBeInTheDocument();
    expect(screen.queryByText("Other concept")).not.toBeInTheDocument();
  });

  it("clears every criterion when the reset button is clicked", async () => {
    const concepts = [concept({ id: "1", label: "Alpha" }), concept({ id: "2", label: "Beta" })];
    renderSearch(concepts, ["/?label=Alpha"]);
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("goes back to the list of concepts when the back button is clicked", async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={SEARCH_PAGE} />
        <Route path="/concepts" element={CONCEPTS_LIST_PAGE} />
      </Routes>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByText("Liste des concepts")).toBeVisible();
  });
});
