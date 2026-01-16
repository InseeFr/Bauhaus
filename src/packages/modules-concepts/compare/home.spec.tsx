import { ConceptGeneral, ConceptNotes } from "../../model/concepts/concept";
import { renderWithAppContext } from "../../tests/render";
import Compare from "./home";

describe("concepts-compare", () => {
  it("renders without crashing", () => {
    renderWithAppContext(
      <Compare
        conceptGeneral={{ conceptVersion: "2" } as ConceptGeneral}
        notes={{ 1: {} as ConceptNotes, 2: {} as ConceptNotes }}
        secondLang={false}
      />,
    );
  });
});
