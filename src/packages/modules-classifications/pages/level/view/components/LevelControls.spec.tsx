import { renderWithRouter } from "../../../../../tests/render";
import { LevelControls as Controls } from "./LevelControls";

describe("classification-level-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls id="nafr2" />);
  });
});
