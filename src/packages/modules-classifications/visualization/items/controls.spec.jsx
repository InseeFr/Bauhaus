import { renderWithRouter } from "../../../tests/render";
import Controls from "./controls";

describe("classification-items-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls />);
  });
});
