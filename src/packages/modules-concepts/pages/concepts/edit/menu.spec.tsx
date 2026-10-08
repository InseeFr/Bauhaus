import { renderWithRouter } from "../../../../tests/render";
import { Menu } from "./menu";

const ERRORS = { errorMessage: ["an error"] };

describe("Menu", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Menu handleSave={vi.fn()} />);
  });

  it("renders with errors", () => {
    renderWithRouter(<Menu handleSave={vi.fn()} errors={ERRORS} />);
  });
});
