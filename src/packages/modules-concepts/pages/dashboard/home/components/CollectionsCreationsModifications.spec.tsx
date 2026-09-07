import { renderWithRouter } from "../../../../../tests/render";
import CollectionsCreationsModifications from "./CollectionsCreationsModifications";

describe("dashboard-collections-edition", () => {
  it("renders without crashing for creations", () => {
    renderWithRouter(<CollectionsCreationsModifications collectionsData={[]} type="creations" />);
  });

  it("renders without crashing for modifications", () => {
    renderWithRouter(
      <CollectionsCreationsModifications collectionsData={[]} type="modifications" />,
    );
  });
});
