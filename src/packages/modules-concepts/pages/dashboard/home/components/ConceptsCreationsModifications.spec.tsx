import { expectNoBootstrapClass } from "../../../../../tests/bootstrap-classes.testing";
import { renderWithRouter } from "../../../../../tests/render";
import { ConceptsCreationsModifications as ConceptsDashboardEdition } from "./ConceptsCreationsModifications";

const NO_CONCEPTS: never[] = [];

describe("dashboard-concepts-edition", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptsDashboardEdition conceptsData={NO_CONCEPTS} type="creations" />);
  });

  it("ne pose aucune classe Bootstrap", () => {
    renderWithRouter(<ConceptsDashboardEdition conceptsData={NO_CONCEPTS} type="creations" />);
    expectNoBootstrapClass();
  });
});
