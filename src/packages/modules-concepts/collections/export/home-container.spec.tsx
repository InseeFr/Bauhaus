import { render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import D from "../../../deprecated-locales/build-dictionary";
import { Component } from "./home-container";

vi.mock("../../hooks/useCollections", () => ({
  useCollections: vi.fn(),
}));

vi.mock("@utils/hooks/collections", () => ({
  useCollectionExporter: vi.fn(),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./home", () => ({
  default: ({ collections }: { collections: { id: string; label: string }[] }) => (
    <div data-testid="collections-to-export">
      <span data-testid="collections-count">{collections.length}</span>
      <ul>
        {collections.map((c) => (
          <li key={c.id} data-testid={`collection-${c.id}`}>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

import { useCollections } from "../../hooks/useCollections";
import { useCollectionExporter } from "@utils/hooks/collections";
import { useTitle } from "@utils/hooks/useTitle";

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );
};

describe("Export Collections Home Container", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCollections as Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (useCollectionExporter as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  describe("Loading State", () => {
    it("should display loading indicator while fetching collections", () => {
      (useCollections as Mock).mockReturnValue({
        data: [],
        isLoading: true,
      });

      renderComponent();

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
    });

    it("should display exporting indicator during export", () => {
      (useCollectionExporter as Mock).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
    });

    it("should prioritize exporting state over loading state", () => {
      (useCollections as Mock).mockReturnValue({
        data: [],
        isLoading: true,
      });
      (useCollectionExporter as Mock).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
    });

    it("should hide loading indicator after collections are fetched", () => {
      (useCollections as Mock).mockReturnValue({
        data: [{ id: "1", label: "Test" }],
        isLoading: false,
      });

      renderComponent();

      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      expect(screen.getByTestId("collections-to-export")).toBeInTheDocument();
    });
  });

  describe("Collections Display", () => {
    it("should display collections after successful fetch", () => {
      const collectionsMock = [
        { id: "1", label: { value: "Collection A", lang: "fr" } },
        { id: "2", label: { value: "Collection B", lang: "fr" } },
        { id: "3", label: { value: "Collection C", lang: "fr" } },
      ];
      (useCollections as Mock).mockReturnValue({
        data: collectionsMock,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByTestId("collections-to-export")).toBeInTheDocument();
      expect(screen.getByTestId("collections-count")).toHaveTextContent("3");
      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
      expect(screen.getByText("Collection C")).toBeInTheDocument();
    });

    it("should display empty list when no collections available", () => {
      (useCollections as Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByTestId("collections-to-export")).toBeInTheDocument();
      expect(screen.getByTestId("collections-count")).toHaveTextContent("0");
    });

    it("should handle undefined data with default empty array", () => {
      (useCollections as Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByTestId("collections-to-export")).toBeInTheDocument();
      expect(screen.getByTestId("collections-count")).toHaveTextContent("0");
    });
  });

  describe("Data transformation", () => {
    it("should call useCollections without arguments", () => {
      renderComponent();

      expect(useCollections).toHaveBeenCalledWith();
    });

    it("should transform collections with label object to flat label", () => {
      (useCollections as Mock).mockReturnValue({
        data: [
          { id: "1", label: { value: "Collection A", lang: "fr" } },
          { id: "2", label: { value: "Collection B", lang: "fr" } },
        ],
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
    });

    it("should handle missing label value", () => {
      (useCollections as Mock).mockReturnValue({
        data: [
          { id: "1", label: { value: "Collection A", lang: "fr" } },
          { id: "2", label: null },
          { id: "3", label: { lang: "fr" } },
        ],
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByTestId("collections-count")).toHaveTextContent("3");
    });
  });

  describe("Title Hook", () => {
    it("should set correct page title", () => {
      renderComponent();

      expect(useTitle).toHaveBeenCalledWith(D.collectionsTitle, D.exportTitle);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single collection", () => {
      (useCollections as Mock).mockReturnValue({
        data: [{ id: "1", label: { value: "Single Collection", lang: "fr" } }],
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByTestId("collections-count")).toHaveTextContent("1");
      expect(screen.getByText("Single Collection")).toBeInTheDocument();
    });

    it("should handle large number of collections", () => {
      const largeCollections = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        label: { value: `Collection ${i}`, lang: "fr" },
      }));

      (useCollections as Mock).mockReturnValue({
        data: largeCollections,
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByTestId("collections-count")).toHaveTextContent("100");
    });

    it("should handle collections with special characters in labels", () => {
      (useCollections as Mock).mockReturnValue({
        data: [
          { id: "1", label: { value: "Collection <test>", lang: "fr" } },
          { id: "2", label: { value: "Collection & Co.", lang: "fr" } },
        ],
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText("Collection <test>")).toBeInTheDocument();
      expect(screen.getByText("Collection & Co.")).toBeInTheDocument();
    });
  });
});
