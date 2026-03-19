import { renderWithRouter } from "../../../../../../tests/render";
import CollectionsCreationsModifications from "./creations-modification";

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
