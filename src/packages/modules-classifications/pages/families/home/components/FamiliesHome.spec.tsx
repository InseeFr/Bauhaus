import { renderWithRouter } from "../../../../../tests/render";
import { FamiliesHome as Home } from "./FamiliesHome";

const families = [{ id: "1", label: "Family 1" }];

describe("families-home", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Home families={families} />);
  });
});
