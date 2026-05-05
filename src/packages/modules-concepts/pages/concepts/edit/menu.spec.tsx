import { renderWithRouter } from "../../../../tests/render";
import { Menu } from "./menu";

describe("Menu", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Menu handleSave={vi.fn()} />);
  });

  it("renders with errors", () => {
    renderWithRouter(<Menu handleSave={vi.fn()} errors={{ errorMessage: ["an error"] }} />);
  });
});
