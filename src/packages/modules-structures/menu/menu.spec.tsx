import { renderWithRouter } from "../../tests/render";
import { Menu } from "./menu";

describe("menu-dsds", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Menu />);
  });
});
