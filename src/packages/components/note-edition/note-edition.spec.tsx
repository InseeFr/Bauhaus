import { render, screen } from "@testing-library/react";

import { AppContextProvider, AppProperties } from "../../application/app-context";
import { renderWithAppContext } from "../../tests/render";
import { NoteEdition } from "./";

describe("note-edition", () => {
  it("renders without crashing", () => {
    renderWithAppContext(
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
        errorMessage={{
          errorMessage: ["error"],
          fields: { field: "error" },
        }}
      />,
    );
  });

  it("nomme la langue de chaque colonne en toutes lettres", () => {
    render(
      <AppContextProvider lg1="fr" lg2="en" properties={{} as AppProperties}>
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
          errorMessage={{ errorMessage: [], fields: {} }}
        />
      </AppContextProvider>,
    );

    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("garde le code de langue tel quel quand il ne désigne aucune langue", () => {
    renderWithAppContext(
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
        errorMessage={{ errorMessage: [], fields: {} }}
      />,
    );

    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("lg2")).toBeInTheDocument();
  });
});
