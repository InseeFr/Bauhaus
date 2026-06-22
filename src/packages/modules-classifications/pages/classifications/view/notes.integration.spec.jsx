import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Notes from "./notes";

// Test d'intégration : contrairement à notes.spec.jsx, on n'mocke PAS
// ExplanatoryNote. On exerce donc le vrai composant, qui appelle text.replace()
// et qui plantait quand notes.jsx lui passait un élément React au lieu d'une string
// (issue InseeFr/Bauhaus#1498).

vi.mock("@components/layout", () => ({
  Row: ({ children }) => <div>{children}</div>,
}));

vi.mock("@components/panel", () => ({
  Panel: ({ title, children }) => (
    <div>
      <span>{title}</span>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock("@uiw/react-md-editor", () => ({
  default: {
    Markdown: ({ source }) => <div data-testid="markdown">{source}</div>,
  },
}));

const renderNotes = (notes, secondLang = false) =>
  render(<Notes notes={notes} secondLang={secondLang} />);

describe("<Notes /> (intégration avec le vrai ExplanatoryNote)", () => {
  it("affiche la scopeNote de la nomenclature sans planter", () => {
    expect(() => renderNotes({ scopeNoteLg1: "Note de portée de la nomenclature" })).not.toThrow();
    expect(screen.getByText("Note de portée de la nomenclature")).toBeInTheDocument();
  });

  it("affiche description, scopeNote et changeNote dans les deux langues sans planter", () => {
    expect(() =>
      renderNotes(
        {
          descriptionLg1: "Description FR",
          descriptionLg2: "Description EN",
          scopeNoteLg1: "Scope FR",
          scopeNoteLg2: "Scope EN",
          changeNoteLg1: "Change FR",
          changeNoteLg2: "Change EN",
        },
        true,
      ),
    ).not.toThrow();

    expect(screen.getByText("Description FR")).toBeInTheDocument();
    expect(screen.getByText("Scope FR")).toBeInTheDocument();
    expect(screen.getByText("Scope EN")).toBeInTheDocument();
    expect(screen.getByText("Change EN")).toBeInTheDocument();
  });
});
