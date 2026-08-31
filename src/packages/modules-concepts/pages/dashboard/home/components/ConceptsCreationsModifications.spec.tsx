import { renderWithRouter } from "../../../../../tests/render";
import { ConceptsCreationsModifications as ConceptsDashboardEdition } from "./ConceptsCreationsModifications";

describe("dashboard-concepts-edition", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptsDashboardEdition conceptsData={[]} type="creations" />);
  });
});
