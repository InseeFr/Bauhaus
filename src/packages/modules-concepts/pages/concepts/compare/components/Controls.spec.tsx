import { renderWithRouter } from "../../../../../tests/render";
import ConceptCompare from "./Controls";

describe("concept-visualization-compare-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptCompare />);
  });
});
