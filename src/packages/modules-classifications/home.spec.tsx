import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../deprecated-locales";
import { PartialClassification } from "../model/Classification";
import ClassificationsHome from "./home";

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("@components/layout", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div data-testid="row">{children}</div>,
}));

vi.mock("@components/page-title", () => ({
  PageTitle: ({ title }: { title: string }) => <div data-testid="page-title">{title}</div>,
}));

vi.mock("@components/searchable-list", () => ({
  SearchableList: ({ items }: { items: any[] }) => (
    <div data-testid="searchable-list">
      {items.map((item, index) => (
        <div key={index}>{item.label}</div>
      ))}
    </div>
  ),
}));

describe("ClassificationsHome Component", () => {
  it("should render without crashing", () => {
    render(<ClassificationsHome classifications={[]} />);
    screen.getByTestId("row");
  });

  it("should call useTitle hook with correct arguments", () => {
    render(<ClassificationsHome classifications={[]} />);
    expect(useTitle).toHaveBeenCalledWith(D.classificationsTitle, D.classificationsTitle);
  });

  it("should display the PageTitle component with the correct title", () => {
    render(<ClassificationsHome classifications={[]} />);
    expect(screen.getByTestId("page-title")).toHaveTextContent(D.classificationsSearchTitle);
  });

  it("should render the SearchableList component", () => {
    const classifications = [
      { id: 1, label: "Classification 1" },
      { id: 2, label: "Classification 2" },
    ] as unknown as PartialClassification[];
    render(<ClassificationsHome classifications={classifications} />);
    const list = screen.getByTestId("searchable-list");
    expect(list).toBeInTheDocument();
    expect(list).toHaveTextContent("Classification 1");
    expect(list).toHaveTextContent("Classification 2");
  });

  it("should render SearchableList with the correct props", () => {
    const classifications = [
      { id: 1, label: "Classification 1" },
    ] as unknown as PartialClassification[];
    render(<ClassificationsHome classifications={classifications} />);
    const list = screen.getByTestId("searchable-list");
    expect(list.children.length).toBe(1);
    expect(list).toHaveTextContent("Classification 1");
  });
});
