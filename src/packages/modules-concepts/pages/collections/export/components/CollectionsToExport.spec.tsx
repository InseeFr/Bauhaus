import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

import { conceptsI18n } from "../../../../i18n";
import {
  expectBackLinkTo,
  expectFilterOnEachPanel,
  expectPanelTitles,
  filterSource,
} from "../../../../testing/pick-list.testing";
import { CollectionsToExport } from "./CollectionsToExport";

const mockExportCollection = vi.fn();

vi.mock("@utils/hooks/collections", () => ({
  useCollectionExporter: () => ({
    mutate: mockExportCollection,
    isPending: false,
  }),
}));

vi.mock(
  "../../../../components/ExportButtons",
  () => import("../../../../testing/export-buttons.testing"),
);

const mockCollections = [
  { id: "1", label: "Collection A" },
  { id: "2", label: "Collection B" },
  { id: "3", label: "Collection C" },
];

const renderComponent = (collections = mockCollections) => {
  return render(
    <I18nextProvider i18n={conceptsI18n}>
      <MemoryRouter>
        <CollectionsToExport collections={collections} />
      </MemoryRouter>
    </I18nextProvider>,
  );
};

const expectEveryCollectionListed = () => {
  expect(screen.getByText("Collection A")).toBeInTheDocument();
  expect(screen.getByText("Collection B")).toBeInTheDocument();
  expect(screen.getByText("Collection C")).toBeInTheDocument();
};

describe("CollectionsToExport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      renderComponent([]);
    });

    it("renders collections in the list", () => {
      renderComponent();

      expectEveryCollectionListed();
    });

    it("renders the page title", () => {
      renderComponent();

      expect(screen.getByText("Export")).toBeInTheDocument();
    });

    it("renders the panel titles", () => {
      renderComponent();

      expectPanelTitles("Available collections (3)", "Collections to export (0)");
    });

    it("renders return button with correct link", () => {
      renderComponent();

      expectBackLinkTo("/concepts/collections");
    });
  });

  describe("Empty state", () => {
    it("renders empty list without errors", () => {
      renderComponent([]);

      expect(screen.queryByText("Collection A")).not.toBeInTheDocument();
    });
  });

  describe("Picker integration", () => {
    it("passes collections to Picker component", () => {
      renderComponent();

      expectEveryCollectionListed();
    });

    it("passes correct context to Picker", () => {
      renderComponent();

      expectBackLinkTo("/concepts/collections");
    });
  });

  describe("Export buttons", () => {
    beforeEach(() => {
      renderComponent();
    });

    it("renders export buttons", () => {
      expect(screen.getByTestId("export-buttons")).toBeInTheDocument();
    });

    it("renders all export button types", () => {
      expect(screen.getByTestId("export-ods")).toBeInTheDocument();
      expect(screen.getByTestId("export-odt")).toBeInTheDocument();
      expect(screen.getByTestId("export-odt-lg2")).toBeInTheDocument();
      expect(screen.getByTestId("export-with-concepts")).toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    beforeEach(() => {
      renderComponent();
    });

    it("has a filter input on each panel", () => {
      expectFilterOnEachPanel();
    });

    it("filters the available collections on their label", () => {
      filterSource("Collection A");

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.queryByText("Collection B")).not.toBeInTheDocument();
    });
  });
});
