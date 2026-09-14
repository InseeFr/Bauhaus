import { renderWithRouter } from "../../tests/render";

import { UnderMaintenance } from ".";

describe("not-found", () => {
  it("renders without crashing", () => {
    renderWithRouter(<UnderMaintenance />);
  });
});
