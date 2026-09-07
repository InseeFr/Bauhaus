import { renderWithRouter } from "../../../../../tests/render";
import { CorrespondenceControls } from "./CorrespondenceControls";

describe("classification-correspondence-association-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<CorrespondenceControls />);
  });
});
