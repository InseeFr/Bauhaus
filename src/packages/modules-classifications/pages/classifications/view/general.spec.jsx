import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import General from "./general";

vi.mock("@components/layout", () => ({
  Row: ({ children }) => <div>{children}</div>,
}));

vi.mock("@components/note", () => ({
  Note: ({ title, text }) => (
    <div>
      <div data-testid="note-title">{title}</div>
      <div data-testid="note-content">{text}</div>
    </div>
  ),
}));

vi.mock("@components/link", () => ({
  ExternalLink: ({ href, children }) => <a href={href}>{children}</a>,
}));

vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  getDisseminationStatus: (v) => `Status: ${v}`,
}));

vi.mock("@utils/date-utils", () => ({
  stringToDate: (v) => `Date: ${v}`,
}));

vi.mock("@utils/html-utils", () => ({
  renderMarkdownElement: (v) => v,
}));

const renderGeneral = (general = {}, secondLang = false) =>
  render(
    <MemoryRouter>
      <General general={general} secondLang={secondLang} />
    </MemoryRouter>,
  );

describe("<General />", () => {
  it("se rend sans planter avec un objet vide", () => {
    renderGeneral({});
  });

  it("affiche le label de série avec un lien vers la série", () => {
    renderGeneral({ seriesLg1: "COICOP", idSeries: "coicop" });
    const link = screen.getByRole("link", { name: "COICOP" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/classifications/series/coicop");
  });

  it("affiche afterLg1 avec un lien vers la classification suivante", () => {
    renderGeneral({
      afterLg1: "COICOP 1998",
      idAfter: "coicop1998",
    });
    const link = screen.getByRole("link", { name: "COICOP 1998" });
    expect(link).toHaveAttribute("href", "/classifications/classification/coicop1998");
  });

  it("affiche beforeLg1 avec un lien vers la classification précédente", () => {
    renderGeneral({ beforeLg1: "COICOP 1993", idBefore: "coicop1993" });
    const link = screen.getByRole("link", { name: "COICOP 1993" });
    expect(link).toHaveAttribute("href", "/classifications/classification/coicop1993");
  });

  it("affiche altLabelLg1 formatté", () => {
    renderGeneral({ altLabelLg1: "Label A || Label B" });
    expect(screen.getAllByTestId("note-content")[0]).toHaveTextContent("Label A - Label B");
  });

  it("affiche le statut de diffusion formatté", () => {
    renderGeneral({
      disseminationStatus: "http://bauhaus/codes/statutDiffusion/Public",
    });
    expect(screen.getAllByTestId("note-content")[0]).toHaveTextContent(
      "Status: http://bauhaus/codes/statutDiffusion/Public",
    );
  });

  it("affiche la date issued formatée", () => {
    renderGeneral({ issued: "2016-01-01T00:00:00.000+01:00" });
    expect(screen.getAllByTestId("note-content")[0]).toHaveTextContent(
      "Date: 2016-01-01T00:00:00.000+01:00",
    );
  });

  it("n'affiche pas altLabelLg2 si secondLang est false", () => {
    renderGeneral({ altLabelLg2: "Label EN" }, false);
    expect(screen.queryByText(/Label EN/)).toBeNull();
  });

  it("affiche un lien externe pour additionalMaterial", () => {
    renderGeneral({ additionalMaterial: "https://example.com/material" });
    const link = screen.getByRole("link", {
      name: "https://example.com/material",
    });
    expect(link).toHaveAttribute("href", "https://example.com/material");
  });
});
