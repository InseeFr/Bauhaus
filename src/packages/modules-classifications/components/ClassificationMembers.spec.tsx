import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ClassificationMembers } from "./ClassificationMembers";

vi.mock("@components/layout", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@components/note", () => ({
  Note: ({ title, text }: { title: string; text: React.ReactNode }) => (
    <div>
      <span data-testid="note-title">{title}</span>
      <div>{text}</div>
    </div>
  ),
}));

const members = [
  { id: "1", labelLg1: "Libellé FR 1", labelLg2: "Label EN 1" },
  { id: "2", labelLg1: "Libellé FR 2", labelLg2: "Label EN 2" },
];

const renderComponent = (overrides: Partial<React.ComponentProps<typeof ClassificationMembers>> = {}) =>
  render(
    <MemoryRouter>
      <ClassificationMembers
        members={members}
        secondLang={false}
        linkBasePath="/classifications/series"
        titleD1="Titre FR"
        titleD2="Titre EN"
        {...overrides}
      />
    </MemoryRouter>,
  );

describe("ClassificationMembers", () => {
  it("affiche les libellés Lg1", () => {
    renderComponent();
    expect(screen.getByText("Libellé FR 1")).toBeInTheDocument();
    expect(screen.getByText("Libellé FR 2")).toBeInTheDocument();
  });

  it("construit les liens avec le bon linkBasePath", () => {
    renderComponent({ linkBasePath: "/classifications/series" });
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/classifications/series/1");
    expect(links[1]).toHaveAttribute("href", "/classifications/series/2");
  });

  it("n'affiche pas les libellés Lg2 quand secondLang est false", () => {
    renderComponent({ secondLang: false });
    expect(screen.queryByText("Label EN 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Label EN 2")).not.toBeInTheDocument();
  });

  it("affiche les libellés Lg2 quand secondLang est true", () => {
    renderComponent({ secondLang: true });
    expect(screen.getByText("Label EN 1")).toBeInTheDocument();
    expect(screen.getByText("Label EN 2")).toBeInTheDocument();
  });

  it("n'affiche pas la section Lg2 quand secondLang est true mais aucun membre n'a de labelLg2", () => {
    const membersWithoutLg2 = [
      { id: "1", labelLg1: "Libellé FR 1" },
      { id: "2", labelLg1: "Libellé FR 2" },
    ];
    renderComponent({ secondLang: true, members: membersWithoutLg2 });
    const titles = screen.getAllByTestId("note-title");
    expect(titles).toHaveLength(1);
    expect(screen.queryByText("Titre EN")).not.toBeInTheDocument();
  });

  it("affiche les titres corrects en mode bilingue", () => {
    renderComponent({ secondLang: true });
    const titles = screen.getAllByTestId("note-title");
    expect(titles[0]).toHaveTextContent("Titre FR");
    expect(titles[1]).toHaveTextContent("Titre EN");
  });

  it("n'affiche qu'un seul titre quand secondLang est false", () => {
    renderComponent({ secondLang: false });
    const titles = screen.getAllByTestId("note-title");
    expect(titles).toHaveLength(1);
    expect(titles[0]).toHaveTextContent("Titre FR");
  });
});
