import { renderWithRouter } from "../../../../../tests/render";
import ConceptsDashboard from "./ConceptsDashboard";

describe("dashboard-home", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptsDashboard conceptsData={[]} collectionsData={[]} />);
  });
});
