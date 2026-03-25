import { renderWithRouter } from "../../../../tests/render";
import ConceptsDashboard from "./home";

describe("dashboard-home", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptsDashboard conceptsData={[]} collectionsData={[]} />);
  });
});
