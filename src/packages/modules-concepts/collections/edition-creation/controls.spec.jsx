import { renderWithRouter } from "../../../tests/render";
import Controls from "./controls";

describe("collection-edition-creation-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <Controls
        handleSave={vi.fn()}
        redirectCancel={() => "collections"}
        errors={{ errorMessage: [], fields: {} }}
      />,
    );
  });
});
