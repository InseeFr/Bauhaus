import { renderWithRouter } from "../../tests/render";
import ConceptValidation from "./home";

describe("concept-validation", () => {
  it("renders without crashing", () => {
    renderWithRouter(
      <ConceptValidation
        concepts={[]}
        permission={{ authType: "" }}
        handleValidateConceptList={vi.fn()}
      />,
    );
  });
});
