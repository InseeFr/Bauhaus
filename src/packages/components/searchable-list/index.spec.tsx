import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";

import { SearchableList } from "./index";

const mockItems = [
  { id: "1", label: "First Item" },
  { id: "2", label: "Second Item" },
  { id: "3", label: "Third Item" },
];

const manyItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: String(i + 1), label: `Item ${i + 1}` }));

const LocationProbe = () => {
  const { search } = useLocation();
  return <output data-testid="location">{search}</output>;
};

const renderAt = (url: string, items: { id: string; label: string }[]) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <SearchableList items={items} childPath="items" />
      <LocationProbe />
    </MemoryRouter>,
  );

const resultLabels = () =>
  within(screen.getByRole("table"))
    .getAllByRole("link")
    .map((link) => link.textContent);

describe("SearchableList", () => {
  it("renders each result as a row of a table", () => {
    renderAt("/", mockItems);

    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getByRole("link")).toHaveAttribute("href", "/items/1");
  });

  it("shows ten results per page by default", () => {
    renderAt("/", manyItems(12));

    expect(resultLabels()).toHaveLength(10);
    expect(resultLabels()[0]).toBe("Item 1");
  });

  it("reads the current page and the page size from the url", () => {
    renderAt("/?page=2&perPage=5", manyItems(12));

    expect(resultLabels()).toEqual(["Item 6", "Item 7", "Item 8", "Item 9", "Item 10"]);
  });

  it("falls back to the first page when the page in the url is out of range", () => {
    renderAt("/?page=5", mockItems);

    expect(resultLabels()).toEqual(["First Item", "Second Item", "Third Item"]);
  });

  it("writes the page in the url when moving to the next page", () => {
    renderAt("/", manyItems(12));

    fireEvent.click(screen.getByRole("button", { name: "Next Page" }));

    expect(resultLabels()).toEqual(["Item 11", "Item 12"]);
    const params = new URLSearchParams(screen.getByTestId("location").textContent!);
    expect(params.get("page")).toBe("2");
    expect(params.get("perPage")).toBe("10");
  });

  it("keeps the page size from the url while searching", () => {
    renderAt("/?perPage=25", manyItems(30));

    fireEvent.change(screen.getByRole("textbox", { name: "Search..." }), {
      target: { value: "Item" },
    });

    expect(resultLabels()).toHaveLength(25);
  });

  it("does not render bootstrap grid or form classes", () => {
    const { container } = render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath="items" advancedSearch searchUrl="/advanced" />
      </MemoryRouter>,
    );

    expect(
      container.querySelector(
        ".row, [class*='col-md-'], .form-group, .list-group, .list-group-item",
      ),
    ).toBeNull();
  });

  it("renders items with string childPath", () => {
    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath="items" />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/items/1");
    expect(links[1]).toHaveAttribute("href", "/items/2");
    expect(links[2]).toHaveAttribute("href", "/items/3");
  });

  it("renders items with function childPath", () => {
    const childPathFn = (item: any) => `custom-${item.id}`;

    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath={childPathFn} />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/custom-1/1");
    expect(links[1]).toHaveAttribute("href", "/custom-2/2");
    expect(links[2]).toHaveAttribute("href", "/custom-3/3");
  });

  it("calls childPath function with correct item parameter", () => {
    const childPathFn = vi.fn((item: any) => `path-${item.id}`);

    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath={childPathFn} />
      </MemoryRouter>,
    );

    expect(childPathFn).toHaveBeenCalledTimes(3);
    expect(childPathFn).toHaveBeenCalledWith(mockItems[0]);
    expect(childPathFn).toHaveBeenCalledWith(mockItems[1]);
    expect(childPathFn).toHaveBeenCalledWith(mockItems[2]);
  });

  it("uses custom label property", () => {
    const itemsWithCustomLabel = [
      { id: "1", name: "Custom Name 1" },
      { id: "2", name: "Custom Name 2" },
    ];

    render(
      <MemoryRouter>
        <SearchableList items={itemsWithCustomLabel} childPath="items" label="name" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Custom Name 1")).toBeInTheDocument();
    expect(screen.getByText("Custom Name 2")).toBeInTheDocument();
  });

  it("applies itemFormatter function", () => {
    const itemFormatter = (content: string) => content.toUpperCase();

    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath="items" itemFormatter={itemFormatter} />
      </MemoryRouter>,
    );

    expect(screen.getByText("FIRST ITEM")).toBeInTheDocument();
    expect(screen.getByText("SECOND ITEM")).toBeInTheDocument();
    expect(screen.getByText("THIRD ITEM")).toBeInTheDocument();
  });

  it("renders search input with default placeholder", () => {
    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath="items" />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText("Label...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders search input with custom placeholder", () => {
    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath="items" placeholder="Custom placeholder" />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText("Custom placeholder");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders advanced search link when enabled", () => {
    render(
      <MemoryRouter>
        <SearchableList
          items={mockItems}
          childPath="items"
          advancedSearch={true}
          searchUrl="/advanced"
        />
      </MemoryRouter>,
    );

    const advancedLink = screen.getByText("Advanced search");
    expect(advancedLink).toBeInTheDocument();
    expect(advancedLink.closest("a")).toHaveAttribute("href", "/advanced");
  });

  it("does not render advanced search link when disabled", () => {
    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath="items" />
      </MemoryRouter>,
    );

    const advancedLink = screen.queryByText("Recherche avancée");
    expect(advancedLink).not.toBeInTheDocument();
  });

  it("filters items on a field other than the label, such as the alternative label", () => {
    const conceptsWithAltLabel = [
      { id: "1", label: "Répertoire des personnes physiques", altLabel: "RNIPP" },
      { id: "2", label: "Second Item", altLabel: null },
    ];

    render(
      <MemoryRouter initialEntries={["/?search=RNIPP"]}>
        <SearchableList items={conceptsWithAltLabel} childPath="concepts" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Répertoire des personnes physiques")).toBeInTheDocument();
    expect(screen.queryByText("Second Item")).not.toBeInTheDocument();
  });

  it("displays result count", () => {
    render(
      <MemoryRouter>
        <SearchableList items={mockItems} childPath="items" />
      </MemoryRouter>,
    );

    const resultCount = screen.getByText(/3 (résultats|results)/);
    expect(resultCount).toBeInTheDocument();
  });
});
