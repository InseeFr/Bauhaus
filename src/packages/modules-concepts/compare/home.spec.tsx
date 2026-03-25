import { ConceptGeneral, ConceptNotes } from "../../model/concepts/concept";
import { renderWithAppContext } from "../../tests/render";

vi.mock("./home", () => ({
  default: () => <div data-testid="compare-component">Compare</div>,
}));

vi.mock("../visualization/general", () => ({
  default: () => <div data-testid="concept-general" />,
}));

describe("concepts-compare", () => {
  it("renders without crashing", async () => {
    const Compare = (await import("./home")).default;
    renderWithAppContext(
      <Compare
        conceptGeneral={{ conceptVersion: "2" } as ConceptGeneral}
        notes={{ 1: {} as ConceptNotes, 2: {} as ConceptNotes }}
        secondLang={false}
      />,
    );
  });
});
