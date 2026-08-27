import { renderWithRouter } from "../../../../../tests/render";
import ConceptValidation from "./ConceptsToValidate";

describe("concept-validation", () => {
  it("renders without crashing", () => {
    renderWithRouter(<ConceptValidation concepts={[]} handleValidateConceptList={vi.fn()} />);
  });
});
