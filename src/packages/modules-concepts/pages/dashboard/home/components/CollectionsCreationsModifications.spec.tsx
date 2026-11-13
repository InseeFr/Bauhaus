import { renderWithRouter } from "../../../../../tests/render";
import { CollectionsCreationsModifications } from "./CollectionsCreationsModifications";

const NO_COLLECTIONS: never[] = [];

describe("dashboard-collections-edition", () => {
  it("renders without crashing for creations", () => {
    renderWithRouter(
      <CollectionsCreationsModifications collectionsData={NO_COLLECTIONS} type="creations" />,
    );
  });

  it("renders without crashing for modifications", () => {
    renderWithRouter(
      <CollectionsCreationsModifications collectionsData={NO_COLLECTIONS} type="modifications" />,
    );
  });
});
