import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { conceptsI18n } from "../../../i18n";
import { Component } from "./page";

vi.mock("../../../hooks/useConceptExporter", () => ({
  useConceptExporter: vi.fn(),
}));

vi.mock("../../../hooks/useConcepts", () => ({
  useConcepts: vi.fn(),
}));

vi.mock("../../../../utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock(
  "../../../components/ExportButtons",
  () => import("../../../testing/export-buttons.testing"),
);

import { useTitle } from "@utils/hooks/useTitle";

import { useConceptExporter } from "../../../hooks/useConceptExporter";
import { useConcepts } from "../../../hooks/useConcepts";

const renderComponent = () => {
  return render(
    <I18nextProvider i18n={conceptsI18n}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </I18nextProvider>,
  );
};

const mockConcepts = [
  { id: "1", label: "Concept A" },
  { id: "2", label: "Concept B" },
  { id: "3", label: "Concept C" },
];

const withConcepts = (concepts: { id: string; label: string }[], isLoading = false) =>
  (useConcepts as Mock).mockReturnValue({ concepts, isLoading });

const withConceptExportInProgress = () =>
  (useConceptExporter as Mock).mockReturnValue({ mutate: vi.fn(), isPending: true });

/** Rend la page une fois les concepts de référence chargés. */
const renderWithConcepts = () => {
  withConcepts(mockConcepts);
  renderComponent();
};

describe("Export Concepts Home Container", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    withConcepts([]);
    (useConceptExporter as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  describe("Loading State", () => {
    it("should display loading indicator while fetching concepts", () => {
      withConcepts([], true);

      renderComponent();

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
    });

    it("should display exporting indicator during export", () => {
      withConceptExportInProgress();

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
    });

    it("should prioritize exporting state over loading state", () => {
      withConcepts([], true);
      withConceptExportInProgress();

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
    });

    it("should hide loading indicator after concepts are fetched", () => {
      renderWithConcepts();

      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
    });
  });

  describe("Concepts Display", () => {
    it("should display concepts after successful fetch", () => {
      renderWithConcepts();

      expect(screen.getByText("Concept A")).toBeInTheDocument();
      expect(screen.getByText("Concept B")).toBeInTheDocument();
      expect(screen.getByText("Concept C")).toBeInTheDocument();
    });

    it("should display empty list when no concepts available", () => {
      withConcepts([]);

      renderComponent();

      expect(screen.queryByText("Concept A")).not.toBeInTheDocument();
    });
  });

  describe("Picker integration", () => {
    it("should pass correct title to Picker", () => {
      renderWithConcepts();

      expect(screen.getByText("Export")).toBeInTheDocument();
    });

    it("should pass correct panel titles to Picker", () => {
      renderWithConcepts();

      expect(screen.getByText("Available concepts (3)")).toBeInTheDocument();
      expect(screen.getByText("Concepts to export (0)")).toBeInTheDocument();
    });

    it("should pass correct context to Picker", () => {
      renderWithConcepts();

      // Use getByText since there are now multiple links (pagination adds links)
      const returnLink = screen.getByText("Back").closest("a");
      expect(returnLink).toHaveAttribute("href", "/concepts");
    });
  });

  describe("Export buttons", () => {
    it("should render export buttons", () => {
      renderWithConcepts();

      expect(screen.getByTestId("export-buttons")).toBeInTheDocument();
    });

    it("should render all export button types", () => {
      renderWithConcepts();

      expect(screen.getByTestId("export-ods")).toBeInTheDocument();
      expect(screen.getByTestId("export-odt")).toBeInTheDocument();
    });
  });

  describe("Title Hook", () => {
    it("should set correct page title", () => {
      renderComponent();

      expect(useTitle).toHaveBeenCalledWith("Concepts", "Export");
    });
  });

  describe("Edge Cases", () => {
    it("should handle single concept", () => {
      withConcepts([{ id: "1", label: "Single Concept" }]);

      renderComponent();

      expect(screen.getByText("Single Concept")).toBeInTheDocument();
    });

    it("should handle large number of concepts", () => {
      withConcepts(Array.from({ length: 100 }, (_, i) => ({ id: `${i}`, label: `Concept ${i}` })));

      renderComponent();

      expect(screen.getByText("Concept 0")).toBeInTheDocument();
    });

    it("should handle concepts with special characters in labels", () => {
      withConcepts([
        { id: "1", label: "Concept <test>" },
        { id: "2", label: "Concept & Co." },
      ]);

      renderComponent();

      expect(screen.getByText("Concept <test>")).toBeInTheDocument();
      expect(screen.getByText("Concept & Co.")).toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    it("should have a search input", () => {
      renderWithConcepts();

      // Une par panneau de la PickList : concepts disponibles et concepts à exporter.
      expect(screen.getAllByPlaceholderText("Label...")).toHaveLength(2);
    });
  });
});
