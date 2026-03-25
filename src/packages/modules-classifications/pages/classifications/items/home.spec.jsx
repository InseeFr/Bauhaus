import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ClassificationItems from "./home";

vi.mock("@components/page-title", () => ({
  PageTitle: ({ title, subtitle }) => (
    <div>
      <h1 data-testid="page-title">{title}</h1>
      {subtitle && <p data-testid="page-subtitle">{subtitle}</p>}
    </div>
  ),
}));

vi.mock("@components/layout", () => ({
  Row: ({ children }) => <div>{children}</div>,
}));

vi.mock("@components/searchable-list", () => ({
  SearchableList: ({ items, childPath }) => (
    <ul data-testid="searchable-list" data-path={childPath}>
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  ),
}));

vi.mock("@components/check-second-lang", () => ({
  CheckSecondLang: () => <div data-testid="check-second-lang" />,
}));

vi.mock("./menu", () => ({
  Menu: () => <div data-testid="controls" />,
}));

const items = [
  { id: "item1", label: "Item 1" },
  { id: "item2", label: "Item 2" },
];

const renderComponent = (props = {}) =>
  render(
    <MemoryRouter>
      <ClassificationItems
        items={[]}
        classificationId="coicop2016"
        subtitle="COICOP 2016"
        {...props}
      />
    </MemoryRouter>,
  );

describe("<ClassificationItems />", () => {
  it("se rend sans planter", () => {
    renderComponent();
  });

  it("affiche les contrôles de navigation", () => {
    renderComponent();
    expect(screen.getByTestId("controls")).toBeInTheDocument();
  });

  it("affiche le composant CheckSecondLang", () => {
    renderComponent();
    expect(screen.getByTestId("check-second-lang")).toBeInTheDocument();
  });

  it("n'affiche pas la liste quand items est vide", () => {
    renderComponent({ items: [] });
    expect(screen.queryByTestId("searchable-list")).toBeNull();
  });

  it("affiche la SearchableList quand items est non vide", () => {
    renderComponent({ items });
    expect(screen.getByTestId("searchable-list")).toBeInTheDocument();
  });

  it("affiche tous les items dans la liste", () => {
    renderComponent({ items });
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("passe le bon childPath à SearchableList", () => {
    renderComponent({ items });
    const list = screen.getByTestId("searchable-list");
    expect(list).toHaveAttribute("data-path", "classifications/classification/coicop2016/item");
  });

  it("affiche le subtitle", () => {
    renderComponent({ subtitle: "COICOP 2016" });
    expect(screen.getByTestId("page-subtitle")).toHaveTextContent("COICOP 2016");
  });
});
