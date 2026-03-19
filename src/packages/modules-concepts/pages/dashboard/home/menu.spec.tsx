import { renderWithRouter } from "../../../../tests/render";
import { Menu } from "./menu";

describe("concept-visualization-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Menu />);
  });
});
