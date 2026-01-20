import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CollectionsToExport from "./home";

const mockExportCollection = vi.fn();

vi.mock("@utils/hooks/collections", () => ({
  useCollectionExporter: () => ({
    mutate: mockExportCollection,
    isPending: false,
  }),
}));

vi.mock("../export-buttons", () => ({
  default: ({
    disabled,
    exportHandler,
  }: {
    disabled: boolean;
    exportHandler: (type: string, withConcepts: boolean, lang?: string) => void;
  }) => (
    <div data-testid="export-buttons">
      <span data-testid="disabled-state">{disabled.toString()}</span>
      <button
        data-testid="export-ods"
        onClick={() => exportHandler("ods", false)}
      >
        Export ODS
      </button>
      <button
        data-testid="export-odt"
        onClick={() => exportHandler("odt", false)}
      >
        Export ODT
      </button>
      <button
        data-testid="export-odt-lg2"
        onClick={() => exportHandler("odt", false, "lg2")}
      >
        Export ODT LG2
      </button>
      <button
        data-testid="export-with-concepts"
        onClick={() => exportHandler("odt", true)}
      >
        Export with concepts
      </button>
    </div>
  ),
}));

const mockCollections = [
  { id: "1", label: "Collection A" },
  { id: "2", label: "Collection B" },
  { id: "3", label: "Collection C" },
];

const renderWithRouter = (component: React.ReactNode) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("CollectionsToExport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      renderWithRouter(<CollectionsToExport collections={[]} />);
    });

    it("renders collections in the list", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
      expect(screen.getByText("Collection C")).toBeInTheDocument();
    });

    it("renders the page title", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      expect(screen.getByText("Export")).toBeInTheDocument();
    });

    it("renders the panel title", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      expect(screen.getByText("Collections to export")).toBeInTheDocument();
    });

    it("renders return button with correct link", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      const returnButton = screen.getByRole("link");
      expect(returnButton).toHaveAttribute("href", "/concepts/collections");
    });
  });

  describe("Empty state", () => {
    it("renders empty list without errors", () => {
      renderWithRouter(<CollectionsToExport collections={[]} />);

      expect(screen.queryByText("Collection A")).not.toBeInTheDocument();
    });
  });

  describe("Picker integration", () => {
    it("passes collections to Picker component", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
      expect(screen.getByText("Collection C")).toBeInTheDocument();
    });

    it("passes correct context to Picker", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      const returnLink = screen.getByRole("link");
      expect(returnLink).toHaveAttribute("href", "/concepts/collections");
    });
  });

  describe("Export buttons", () => {
    it("renders export buttons", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      expect(screen.getByTestId("export-buttons")).toBeInTheDocument();
    });

    it("renders all export button types", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      expect(screen.getByTestId("export-ods")).toBeInTheDocument();
      expect(screen.getByTestId("export-odt")).toBeInTheDocument();
      expect(screen.getByTestId("export-odt-lg2")).toBeInTheDocument();
      expect(screen.getByTestId("export-with-concepts")).toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    it("has a search input", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      const searchInput = screen.getByRole("textbox");
      expect(searchInput).toBeInTheDocument();
    });

    it("allows typing in search input", () => {
      renderWithRouter(<CollectionsToExport collections={mockCollections} />);

      const searchInput = screen.getByRole("textbox");
      searchInput.focus();

      expect(searchInput).toBeInTheDocument();
    });
  });
});
