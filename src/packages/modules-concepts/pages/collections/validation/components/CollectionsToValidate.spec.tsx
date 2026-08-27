import { fireEvent, screen, within } from "@testing-library/react";

import { renderWithRouter } from "../../../../../tests/render";
import CollectionsToValidate from "./CollectionsToValidate";

const mockCollections = [
  { id: "1", label: "Collection A", creator: "DG75-L201" },
  { id: "2", label: "Collection B", creator: "DG75-F170" },
  { id: "3", label: "Collection C", creator: "DG75-H320" },
];

const availableList = () => screen.getAllByRole("listbox")[0];
const toPublishList = () => screen.getAllByRole("listbox")[1];

const optionLabels = (list: HTMLElement) =>
  within(list)
    .queryAllByRole("option")
    .map((option) => option.textContent);

const pick = (label: string) => {
  fireEvent.click(within(availableList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
};

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

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Publication of the provisional collections",
      );
    });

    it("renders the panel titles", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      expect(screen.getByText("Provisional collections (3)")).toBeInTheDocument();
      expect(screen.getByText("Collections to publish (0)")).toBeInTheDocument();
    });

    it("renders return button with correct link", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      // Use getByText since there are now multiple links (pagination adds links)
      const returnButton = screen.getByText("Back").closest("a");
      expect(returnButton).toHaveAttribute("href", "/concepts/collections");
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
    it("moves a collection to the panel of collections to publish", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      pick("Collection A");

      expect(optionLabels(toPublishList())).toEqual(["Collection A"]);
      expect(optionLabels(availableList())).toEqual(["Collection B", "Collection C"]);
    });

    it("publishes every selected collection", () => {
      const handleValidateCollectionList = vi.fn();
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={handleValidateCollectionList}
        />,
      );

      pick("Collection A");
      pick("Collection B");
      fireEvent.click(screen.getByRole("button", { name: "Publish" }));

      expect(handleValidateCollectionList).toHaveBeenCalledWith(["1", "2"]);
    });

    it("warns when no collection is selected", () => {
      const handleValidateCollectionList = vi.fn();
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={handleValidateCollectionList}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "Publish" }));

      expect(screen.getByText("Add at least one collection to publish")).toBeInTheDocument();
      expect(handleValidateCollectionList).not.toHaveBeenCalled();
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
    it("has a filter input on each panel", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      expect(screen.getAllByPlaceholderText("Label...")).toHaveLength(2);
    });

    it("filters the available collections on their label", () => {
      renderWithRouter(
        <CollectionsToValidate
          collections={mockCollections}
          handleValidateCollectionList={vi.fn()}
        />,
      );

      fireEvent.input(screen.getAllByPlaceholderText("Label...")[0], {
        target: { value: "Collection A" },
      });

      expect(optionLabels(availableList())).toEqual(["Collection A"]);
    });
  });
});
