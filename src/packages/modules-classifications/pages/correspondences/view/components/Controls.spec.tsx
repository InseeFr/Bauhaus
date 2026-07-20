import { renderWithRouter } from "../../../../../tests/render";
import Controls from "./Controls";

describe("classification-correspondence-visualization-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls />);
  });
});
