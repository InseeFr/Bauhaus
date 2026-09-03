import { renderWithRouter } from "../../../../../tests/render";
import { CorrespondencesHome as Home } from "./CorrespondencesHome";

const correspondences = [{ id: "1", label: "Correspondence 1" }];

describe("correspondences-home", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Home correspondences={correspondences} />);
  });
});
