import { renderWithRouter } from "../../../tests/render";
import Controls from "./controls";

describe("classification-series-visualization-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls />);
  });
});
