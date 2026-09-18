import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { Component } from "./page";

const translations: Record<string, string> = {
  "collection.title": "Collections",
  "common.exportTitle": "Export",
};

vi.mock("react-i18next", async () =>
  (await import("../../../testing/i18n.testing")).translatingWith(() => translations),
);

vi.mock("../../../hooks/useCollections", () => ({
  useCollections: vi.fn(),
}));

vi.mock("@utils/hooks/collections", () => ({
  useCollectionExporter: vi.fn(),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./components/CollectionsToExport", () => ({
  CollectionsToExport: ({ collections }: { collections: { id: string; label: string }[] }) => (
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

import { useCollectionExporter } from "@utils/hooks/collections";
import { useTitle } from "@utils/hooks/useTitle";

import { useCollections } from "../../../hooks/useCollections";

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );
};

const givenCollections = (data: unknown, isLoading = false) =>
  (useCollections as Mock).mockReturnValue({ data, isLoading });

const givenCollectionExportPending = () =>
  (useCollectionExporter as Mock).mockReturnValue({ mutate: vi.fn(), isPending: true });

describe("Export Collections Home Container", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    givenCollections([]);
    (useCollectionExporter as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  describe("Loading State", () => {
    it("should display loading indicator while fetching collections", () => {
      givenCollections([], true);

      renderComponent();

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
    });

    it("should display exporting indicator during export", () => {
      givenCollectionExportPending();

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
    });

    it("should prioritize exporting state over loading state", () => {
      givenCollections([], true);
      givenCollectionExportPending();

      renderComponent();

      expect(screen.getByText("Export in progress...")).toBeInTheDocument();
      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
    });

    it("should hide loading indicator after collections are fetched", () => {
      givenCollections([{ id: "1", label: "Test" }]);

      renderComponent();

      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      expect(screen.getByTestId("collections-to-export")).toBeInTheDocument();
    });
  });

  describe("Collections Display", () => {
    it("should display collections after successful fetch", () => {
      givenCollections([
        { id: "1", label: { value: "Collection A", lang: "fr" } },
        { id: "2", label: { value: "Collection B", lang: "fr" } },
        { id: "3", label: { value: "Collection C", lang: "fr" } },
      ]);

      renderComponent();

      expect(screen.getByTestId("collections-to-export")).toBeInTheDocument();
      expect(screen.getByTestId("collections-count")).toHaveTextContent("3");
      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
      expect(screen.getByText("Collection C")).toBeInTheDocument();
    });

    it("should display empty list when no collections available", () => {
      givenCollections([]);

      renderComponent();

      expect(screen.getByTestId("collections-to-export")).toBeInTheDocument();
      expect(screen.getByTestId("collections-count")).toHaveTextContent("0");
    });

    it("should handle undefined data with default empty array", () => {
      givenCollections(undefined);

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
      givenCollections([
        { id: "1", label: { value: "Collection A", lang: "fr" } },
        { id: "2", label: { value: "Collection B", lang: "fr" } },
      ]);

      renderComponent();

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
    });

    it("should handle missing label value", () => {
      givenCollections([
        { id: "1", label: { value: "Collection A", lang: "fr" } },
        { id: "2", label: null },
        { id: "3", label: { lang: "fr" } },
      ]);

      renderComponent();

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByTestId("collections-count")).toHaveTextContent("3");
    });
  });

  describe("Title Hook", () => {
    it("should set correct page title", () => {
      renderComponent();

      expect(useTitle).toHaveBeenCalledWith(
        translations["collection.title"],
        translations["common.exportTitle"],
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle single collection", () => {
      givenCollections([{ id: "1", label: { value: "Single Collection", lang: "fr" } }]);

      renderComponent();

      expect(screen.getByTestId("collections-count")).toHaveTextContent("1");
      expect(screen.getByText("Single Collection")).toBeInTheDocument();
    });

    it("should handle large number of collections", () => {
      givenCollections(
        Array.from({ length: 100 }, (_, i) => ({
          id: `${i}`,
          label: { value: `Collection ${i}`, lang: "fr" },
        })),
      );

      renderComponent();

      expect(screen.getByTestId("collections-count")).toHaveTextContent("100");
    });

    it("should handle collections with special characters in labels", () => {
      givenCollections([
        { id: "1", label: { value: "Collection <test>", lang: "fr" } },
        { id: "2", label: { value: "Collection & Co.", lang: "fr" } },
      ]);

      renderComponent();

      expect(screen.getByText("Collection <test>")).toBeInTheDocument();
      expect(screen.getByText("Collection & Co.")).toBeInTheDocument();
    });
  });
});
