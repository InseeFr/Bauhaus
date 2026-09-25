import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";

import { AppContextProvider, AppProperties } from "../../application/app-context";
import { renderWithAppContext } from "../../tests/render";
import { NoteEdition } from "./";

const noteEdition = (
  errorMessage: ComponentProps<typeof NoteEdition>["errorMessage"] = {
    errorMessage: [],
    fields: {},
  },
) => (
  <NoteEdition
    notes={{
      scopeNoteLg1: "scopeNote1",
      scopeNoteLg2: "scopeNote2",
      definitionLg1: "definitionLg1",
    }}
    noteLg1Name="scopeNoteLg1"
    noteLg2Name="scopeNoteLg2"
    handleChangeLg1={vi.fn()}
    handleChangeLg2={vi.fn()}
    maxLength={0}
    errorMessage={errorMessage}
  />
);

describe("note-edition", () => {
  it("renders without crashing", () => {
    renderWithAppContext(
      noteEdition({
        errorMessage: ["error"],
        fields: { field: "error" },
      }),
    );
  });

  it("nomme la langue de chaque colonne en toutes lettres", () => {
    render(
      <AppContextProvider lg1="fr" lg2="en" properties={{} as AppProperties}>
        {noteEdition()}
      </AppContextProvider>,
    );

    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("garde le code de langue tel quel quand il ne désigne aucune langue", () => {
    renderWithAppContext(noteEdition());

    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("lg2")).toBeInTheDocument();
  });
});
