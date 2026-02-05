import { fireEvent, screen } from "@testing-library/react";

import { renderWithRouter } from "../../../tests/render";
import CollectionsToValidate from "./home";

const mockCollections = [
  { id: "1", label: "Collection A", creator: "DG75-L201" },
  { id: "2", label: "Collection B", creator: "DG75-F170" },
  { id: "3", label: "Collection C", creator: "DG75-H320" },
];

describe("CollectionsToValidate", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      renderWithRouter(
        <CollectionsToValidate collections={[]} handleValidateCollectionList={vi.fn()} />,
      );
    });

    it("renders collections in the list", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
      expect(screen.getByText("Collection C")).toBeInTheDocument();
    });

    it("renders the page title", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      expect(screen.getByText("Collections to publish")).toBeInTheDocument();
    });

    it("renders the panel title", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      expect(screen.getByText("Collections to publish")).toBeInTheDocument();
    });

    it("renders return button with correct link", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      const returnButton = screen.getByRole("link");
      expect(returnButton).toHaveAttribute("href", "/collections");
    });
  });

  describe("Empty state", () => {
    it("renders empty list without errors", () => {
      renderWithRouter(
        <CollectionsToValidate collections={[]} handleValidateCollectionList={vi.fn()} />,
      );

      expect(screen.queryByText("Collection A")).not.toBeInTheDocument();
    });
  });

  describe("Item selection", () => {
    it("allows selecting a collection", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      const collectionItem = screen.getByText("Collection A");
      fireEvent.click(collectionItem);

      expect(screen.getByText("Collection A")).toBeInTheDocument();
    });

    it("allows selecting multiple collections", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByText("Collection A"));
      fireEvent.click(screen.getByText("Collection B"));

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("renders publish button", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      expect(screen.getByText("Publish")).toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    it("has a search input", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      const searchInput = screen.getByRole("textbox");
      expect(searchInput).toBeInTheDocument();
    });

    it("allows typing in search input", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "Collection A" } });

      expect(searchInput).toHaveValue("Collection A");
    });
  });
});
