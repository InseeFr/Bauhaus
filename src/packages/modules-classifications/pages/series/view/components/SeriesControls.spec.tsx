import { renderWithRouter } from "../../../../../tests/render";
import { SeriesControls as Controls } from "./SeriesControls";

describe("classification-series-visualization-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls />);
  });
});
