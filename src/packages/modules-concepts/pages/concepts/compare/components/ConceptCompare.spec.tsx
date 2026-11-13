import { ConceptGeneral, ConceptNotes } from "@model/concepts/concept";

import { renderWithAppContext } from "../../../../../tests/render";

vi.mock("./ConceptCompare", () => ({
  ConceptCompare: () => <div data-testid="compare-component">Compare</div>,
}));

vi.mock("../visualization/general", () => ({
  default: () => <div data-testid="concept-general" />,
}));

const CONCEPT_GENERAL = { conceptVersion: "2" } as ConceptGeneral;
const NOTES = { 1: {} as ConceptNotes, 2: {} as ConceptNotes };

describe("concepts-compare", () => {
  it("renders without crashing", async () => {
    const Compare = (await import("./ConceptCompare")).ConceptCompare;
    renderWithAppContext(
      <Compare conceptGeneral={CONCEPT_GENERAL} notes={NOTES} secondLang={false} />,
    );
  });
});
