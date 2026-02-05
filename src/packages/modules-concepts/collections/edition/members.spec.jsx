import { renderWithRouter } from "../../../tests/render";
import CollectionMembers from "./members";

describe("collection-edition-creation-members", () => {
  it("renders without crashing", () => {
    renderWithRouter(<CollectionMembers members={[]} conceptList={[]} handleChange={vi.fn()} />);
  });
});
