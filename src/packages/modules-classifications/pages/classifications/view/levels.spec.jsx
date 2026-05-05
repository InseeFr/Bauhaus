import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Levels from "./levels";

vi.mock("@components/layout", () => ({
  Row: ({ children }) => <div>{children}</div>,
}));

vi.mock("@components/note", () => ({
  Note: ({ title, text }) => (
    <div>
      <div data-testid="note-title">{title}</div>
      <ul>{text}</ul>
    </div>
  ),
}));

const levels = [
  { id: "divisions", labelLg1: "Divisions", labelLg2: "Divisions EN" },
  { id: "groupes", labelLg1: "Groupes", labelLg2: "Groups EN" },
];

const renderLevels = (props = {}) =>
  render(
    <MemoryRouter>
      <Levels levels={levels} classificationId="coicop2016" secondLang={false} {...props} />
    </MemoryRouter>,
  );

describe("<Levels />", () => {
  it("se rend sans planter", () => {
    renderLevels();
  });

  it("affiche un lien pour chaque niveau en Lg1", () => {
    renderLevels();
    const link1 = screen.getByRole("link", { name: "Divisions" });
    const link2 = screen.getByRole("link", { name: "Groupes" });
    expect(link1).toBeInTheDocument();
    expect(link2).toBeInTheDocument();
  });

  it("les liens pointent vers le bon chemin", () => {
    renderLevels();
    const link = screen.getByRole("link", { name: "Divisions" });
    expect(link).toHaveAttribute(
      "href",
      "/classifications/classification/coicop2016/level/divisions",
    );
  });

  it("n'affiche pas la colonne Lg2 si secondLang est false", () => {
    renderLevels({ secondLang: false });
    expect(screen.queryByText("Divisions EN")).toBeNull();
  });

  it("affiche les libellés Lg2 si secondLang est true", () => {
    renderLevels({ secondLang: true });
    expect(screen.getByText("Divisions EN")).toBeInTheDocument();
    expect(screen.getByText("Groups EN")).toBeInTheDocument();
  });

  it("les liens Lg2 pointent vers le bon chemin", () => {
    renderLevels({ secondLang: true });
    const links = screen.getAllByRole("link", { name: "Divisions EN" });
    expect(links[0]).toHaveAttribute(
      "href",
      "/classifications/classification/coicop2016/level/divisions",
    );
  });

  it("se rend avec une liste vide de niveaux", () => {
    render(
      <MemoryRouter>
        <Levels levels={[]} classificationId="coicop2016" secondLang={false} />
      </MemoryRouter>,
    );
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
