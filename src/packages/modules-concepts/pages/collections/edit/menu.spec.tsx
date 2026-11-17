import { renderWithRouter } from "../../../../tests/render";
import { Menu } from "./menu";

const NO_ERRORS = { errorMessage: [], fields: {} };
const redirectCancel = () => "collections";

describe("collection-edition-creation-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <Menu handleSave={vi.fn()} redirectCancel={redirectCancel} errors={NO_ERRORS} />,
    );
  });
});
