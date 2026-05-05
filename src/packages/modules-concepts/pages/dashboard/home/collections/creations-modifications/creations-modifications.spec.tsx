import { renderWithRouter } from "../../../../../../tests/render";
import CollectionsDashboardEdition from "./creations-modification";

describe("dashboard-collections-edition", () => {
  it("renders without crashing", () => {
    renderWithRouter(<CollectionsDashboardEdition collectionsData={[]} type="creations" />);
  });
});
