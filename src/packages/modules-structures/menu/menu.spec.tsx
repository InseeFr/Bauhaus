import { Menu } from "./menu";
import { renderWithRouter } from "../../tests/render";

describe("menu-dsds", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Menu />);
  });
});
