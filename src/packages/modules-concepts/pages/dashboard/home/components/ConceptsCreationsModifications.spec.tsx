import { renderWithRouter } from "../../../../../tests/render";
import { ConceptsCreationsModifications as ConceptsDashboardEdition } from "./ConceptsCreationsModifications";

const NO_CONCEPTS: never[] = [];

describe("dashboard-concepts-edition", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptsDashboardEdition conceptsData={NO_CONCEPTS} type="creations" />);
  });
});
