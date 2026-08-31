import { render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

import conceptsI18n from "../../../i18n";
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

vi.mock("../../../components/ExportButtons", () => ({
  ExportButtons: ({
    disabled,
    exportHandler,
  }: {
    disabled: boolean;
    exportHandler: (type: string, withConcepts: boolean, lang?: string) => void;
  }) => (
    <div data-testid="export-buttons">
      <span data-testid="disabled-state">{disabled.toString()}</span>
      <button data-testid="export-ods" onClick={() => exportHandler("ods", false)}>
        Export ODS
      </button>
      <button data-testid="export-odt" onClick={() => exportHandler("odt", false)}>
        Export ODT
      </button>
    </div>
  ),
}));

import { useConceptExporter } from "../../../hooks/useConceptExporter";
import { useConcepts } from "../../../hooks/useConcepts";
import { useTitle } from "../../../../utils/hooks/useTitle";

const renderComponent = () => {
  return render(
    <I18nextProvider i18n={conceptsI18n}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </I18nextProvider>,
  );
};

describe("Export Concepts Home Container", () => {
  const mockConcepts = [
    { id: "1", label: "Concept A" },
    { id: "2", label: "Concept B" },
    { id: "3", label: "Concept C" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useConcepts as Mock).mockReturnValue({
      concepts: [],
      isLoading: false,
    });
    (useConceptExporter as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  describe("Loading State", () => {
    it("should display loading indicator while fetching concepts", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: [],
        isLoading: true,
      });

      renderComponent();

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
    });

    it("should display exporting indicator during export", () => {
      (useConceptExporter as Mock).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
    });

    it("should prioritize exporting state over loading state", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: [],
        isLoading: true,
      });
      (useConceptExporter as Mock).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
    });

    it("should hide loading indicator after concepts are fetched", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
    });
  });

  describe("Concepts Display", () => {
    it("should display concepts after successful fetch", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Concept A")).toBeInTheDocument();
      expect(screen.getByText("Concept B")).toBeInTheDocument();
      expect(screen.getByText("Concept C")).toBeInTheDocument();
    });

    it("should display empty list when no concepts available", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: [],
        isLoading: false,
      });

      renderComponent();

      expect(screen.queryByText("Concept A")).not.toBeInTheDocument();
    });
  });

  describe("Picker integration", () => {
    it("should pass correct title to Picker", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Export")).toBeInTheDocument();
    });

    it("should pass correct panel titles to Picker", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Available concepts (3)")).toBeInTheDocument();
      expect(screen.getByText("Concepts to export (0)")).toBeInTheDocument();
    });

    it("should pass correct context to Picker", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

      // Use getByText since there are now multiple links (pagination adds links)
      const returnLink = screen.getByText("Back").closest("a");
      expect(returnLink).toHaveAttribute("href", "/concepts");
    });
  });

  describe("Export buttons", () => {
    it("should render export buttons", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByTestId("export-buttons")).toBeInTheDocument();
    });

    it("should render all export button types", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

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
      (useConcepts as Mock).mockReturnValue({
        concepts: [{ id: "1", label: "Single Concept" }],
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Single Concept")).toBeInTheDocument();
    });

    it("should handle large number of concepts", () => {
      const largeConcepts = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        label: `Concept ${i}`,
      }));

      (useConcepts as Mock).mockReturnValue({
        concepts: largeConcepts,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Concept 0")).toBeInTheDocument();
    });

    it("should handle concepts with special characters in labels", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: [
          { id: "1", label: "Concept <test>" },
          { id: "2", label: "Concept & Co." },
        ],
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Concept <test>")).toBeInTheDocument();
      expect(screen.getByText("Concept & Co.")).toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    it("should have a search input", () => {
      (useConcepts as Mock).mockReturnValue({
        concepts: mockConcepts,
        isLoading: false,
      });

      renderComponent();

      // Une par panneau de la PickList : concepts disponibles et concepts à exporter.
      expect(screen.getAllByPlaceholderText("Label...")).toHaveLength(2);
    });
  });
});
