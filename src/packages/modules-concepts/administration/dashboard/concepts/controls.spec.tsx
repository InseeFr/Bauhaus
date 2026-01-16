import { renderWithRouter } from "../../../../tests/render";
import ConceptDashboardControls from "./controls";

describe("concept-visualization-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptDashboardControls />);
  });
});
