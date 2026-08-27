import { render } from "@testing-library/react";

import { ConceptNotes as ConceptNotesType } from "../../../../../model/concepts/concept";
import { emptyConceptNotes } from "../../../../utils/emptyConceptNotes";
import ConceptNotes from "./NotesEdition";

describe("concept-edition-creation-notes", () => {
  it("renders without crashing", () => {
    render(
      <ConceptNotes
        notes={emptyConceptNotes as unknown as ConceptNotesType}
        disseminationStatus=""
        handleChange={vi.fn()}
        maxLengthScopeNote={1000}
      />,
    );
  });
});
