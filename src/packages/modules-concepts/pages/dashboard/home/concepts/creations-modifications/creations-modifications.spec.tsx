import { renderWithRouter } from "../../../../../../tests/render";
import ConceptsDashboardEdition from "./creations-modifications";

describe("dashboard-concepts-edition", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptsDashboardEdition conceptsData={[]} type="creations" />);
  });
});
