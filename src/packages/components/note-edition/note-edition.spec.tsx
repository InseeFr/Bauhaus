import { render } from "@testing-library/react";

import { NoteEdition } from "./";

describe("note-edition", () => {
  it("renders without crashing", () => {
    render(
      <NoteEdition
        notes={{
          scopeNoteLg1: "scopeNote1",
          scopeNoteLg2: "scopeNote2",
          definitionLg1: "definitionLg1",
        }}
        noteLg1Name="noteLg1Name"
        noteLg2Name="noteLg2Name"
        handleChangeLg1={vi.fn()}
        handleChangeLg2={vi.fn()}
        maxLength={0}
        errorMessage={{
          errorMessage: ["error"],
          fields: { field: "error" },
        }}
      />,
    );
  });
});
