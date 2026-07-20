import { renderWithRouter } from "../../../../../tests/render";
import Controls from "./Controls";

describe("classification-series-visualization-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls />);
  });
});
