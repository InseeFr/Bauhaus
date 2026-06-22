import { renderWithRouter } from "../../../../tests/render";
import { Menu } from "./menu";

describe("collection-edition-creation-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <Menu
        handleSave={vi.fn()}
        redirectCancel={() => "collections"}
        errors={{ errorMessage: [], fields: {} }}
      />,
    );
  });
});
