import { render } from "@testing-library/react";

import { locales } from "../../tests/default-values";
import { emptyNotes } from "../utils/notes";
import ConceptNotes from "./notes";

describe("concept-edition-creation-notes", () => {
  it("renders without crashing", () => {
    render(
      <ConceptNotes
        notes={emptyNotes}
        disseminationStatus=""
        handleChange={vi.fn()}
        langs={locales}
      />,
    );
  });
});
