import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Notes from "./notes";

vi.mock("@components/layout", () => ({
  Row: ({ children }) => <div>{children}</div>,
}));

vi.mock("@components/explanatory-note", () => ({
  ExplanatoryNote: ({ title, text }) => (
    <div>
      <span data-testid="note-title">{title}</span>
      <div>{text}</div>
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

describe("<Notes />", () => {
  it("se rend sans planter avec un objet vide", () => {
    renderNotes({});
  });

  it("n'affiche rien si toutes les notes sont vides", () => {
    const { container } = renderNotes({});
    expect(container.querySelectorAll("[data-testid='note-title']")).toHaveLength(0);
  });

  it("affiche scopeNoteLg1 quand il est présent", () => {
    renderNotes({ scopeNoteLg1: "Scope FR" });
    expect(screen.getByText("Scope FR")).toBeInTheDocument();
  });

  it("n'affiche pas scopeNoteLg2 si secondLang est false", () => {
    renderNotes({ scopeNoteLg1: "Scope FR", scopeNoteLg2: "Scope EN" }, false);
    expect(screen.queryByText("Scope EN")).toBeNull();
  });

  it("affiche scopeNoteLg2 si secondLang est true", () => {
    renderNotes({ scopeNoteLg1: "Scope FR", scopeNoteLg2: "Scope EN" }, true);
    expect(screen.getByText("Scope EN")).toBeInTheDocument();
  });

  it("affiche changeNoteLg1 quand il est présent", () => {
    renderNotes({ changeNoteLg1: "Change FR" });
    expect(screen.getByText("Change FR")).toBeInTheDocument();
  });

  it("n'affiche pas changeNoteUriLg2 si secondLang est false", () => {
    renderNotes({ changeNoteLg1: "Change FR", changeNoteLg2: "Change EN" }, false);
    expect(screen.queryByText("Change EN")).toBeNull();
  });

  it("affiche changeNoteLg2 si secondLang est true", () => {
    renderNotes({ changeNoteLg1: "Change FR", changeNoteLg2: "Change EN" }, true);
    expect(screen.getByText("Change EN")).toBeInTheDocument();
  });

  it("affiche descriptionLg1 quand il est présent", () => {
    renderNotes({ descriptionLg1: "Description FR" });
    expect(screen.getByText("Description FR")).toBeInTheDocument();
  });

  it("n'affiche pas descriptionLg1 si absent", () => {
    renderNotes({ changeNoteLg1: "Change FR" });
    expect(screen.queryByText("Description FR")).toBeNull();
  });
});
