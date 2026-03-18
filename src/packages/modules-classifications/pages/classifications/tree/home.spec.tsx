import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ClassificationTree from "./home";

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("@components/layout", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@components/page-title", () => ({
  PageTitle: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h1 data-testid="page-title">{title}</h1>
      <p data-testid="page-subtitle">{subtitle}</p>
    </div>
  ),
}));

vi.mock("@components/check-second-lang", () => ({
  CheckSecondLang: () => <div data-testid="check-second-lang" />,
}));

vi.mock("./menu", () => ({
  Menu: () => <div data-testid="controls" />,
}));

vi.mock("primereact/tree", () => ({
  Tree: ({ value, nodeTemplate }: any) => (
    <ul role="tree" data-testid="tree">
      {value?.map((node: any) => (
        <li key={node.key} role="treeitem">
          {nodeTemplate ? nodeTemplate(node) : node.label}
        </li>
      ))}
    </ul>
  ),
}));

const treeData = [
  { id: "1", labelLg1: "Root Item 1", labelLg2: "Root Item 1 EN" },
  { id: "2", labelLg1: "Root Item 2", labelLg2: "Root Item 2 EN" },
  { id: "3", labelLg1: "Child Item", labelLg2: "Child Item EN", parent: "1" },
];

const renderTree = (props: Record<string, any> = {}) =>
  render(
    <MemoryRouter initialEntries={["/classifications/classification/coicop2016/tree"]}>
      <Routes>
        <Route
          path="/classifications/classification/:id/tree"
          element={
            <ClassificationTree
              data={treeData}
              prefLabel="COICOP 2016"
              secondLang={false}
              {...props}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe("<ClassificationTree />", () => {
  it("se rend sans planter", () => {
    renderTree();
  });

  it("affiche les contrôles de navigation", () => {
    renderTree();
    expect(screen.getByTestId("controls")).toBeInTheDocument();
  });

  it("affiche le composant CheckSecondLang", () => {
    renderTree();
    expect(screen.getByTestId("check-second-lang")).toBeInTheDocument();
  });

  it("n'affiche pas l'arbre si data est vide", () => {
    renderTree({ data: [] });
    expect(screen.queryByTestId("tree")).toBeNull();
  });

  it("affiche l'arbre si data est non vide", () => {
    renderTree();
    expect(screen.getByTestId("tree")).toBeInTheDocument();
  });

  it("affiche les libellés Lg1 par défaut", () => {
    renderTree({ secondLang: false });
    expect(screen.getByText("Root Item 1")).toBeInTheDocument();
    expect(screen.getByText("Root Item 2")).toBeInTheDocument();
  });

  it("affiche les libellés Lg2 quand secondLang est true", () => {
    renderTree({ secondLang: true });
    expect(screen.getByText("Root Item 1 EN")).toBeInTheDocument();
    expect(screen.getByText("Root Item 2 EN")).toBeInTheDocument();
  });

  it("les liens des noeuds pointent vers le bon item", () => {
    renderTree();
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(
        /^\/classifications\/classification\/coicop2016\/item\//,
      );
    });
  });

  it("affiche le subtitle de la page", () => {
    renderTree({ prefLabel: "COICOP 2016" });
    expect(screen.getByTestId("page-subtitle")).toHaveTextContent("COICOP 2016");
  });

  it("structure parent-enfant : l'enfant n'est pas à la racine", () => {
    renderTree();
    const treeItems = screen.getAllByRole("treeitem");
    // 2 root nodes (1 and 2), child "3" is nested under "1" — Tree mock flattens, so 3 items total
    expect(treeItems.length).toBe(2);
  });
});
