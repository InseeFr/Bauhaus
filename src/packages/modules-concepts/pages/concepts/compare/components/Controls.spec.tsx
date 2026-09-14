import { renderWithRouter } from "../../../../../tests/render";
import { Controls as ConceptCompare } from "./Controls";

describe("concept-visualization-compare-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptCompare />);
  });
});
