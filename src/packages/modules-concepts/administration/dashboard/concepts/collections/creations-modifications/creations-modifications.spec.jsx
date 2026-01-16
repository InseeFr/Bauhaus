import { renderWithRouter } from "../../../../../../tests/render";
import CollectionsDashboardEdition from "./";

describe("dashboard-collections-edition", () => {
  it("renders without crashing", () => {
    renderWithRouter(<CollectionsDashboardEdition collectionsData={[]} type="creations" />);
  });
});
