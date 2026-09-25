import { fireEvent, screen } from "@testing-library/react";

import { renderWithRouter } from "../../../../../tests/render";
import {
  expectBackLinkTo,
  expectFilterOnEachPanel,
  expectPanelTitles,
  filterSource,
  moveToTarget as pick,
  optionLabels,
  sourceList as availableList,
  targetList as toPublishList,
} from "../../../../testing/pick-list.testing";
import { CollectionsToValidate } from "./CollectionsToValidate";

const mockCollections = [
  { id: "1", label: "Collection A", creator: "DG75-L201" },
  { id: "2", label: "Collection B", creator: "DG75-F170" },
  { id: "3", label: "Collection C", creator: "DG75-H320" },
];

const renderComponent = (
  props: Partial<React.ComponentProps<typeof CollectionsToValidate>> = {},
) => {
  const handleValidateCollectionList = vi.fn();
  renderWithRouter(
    <CollectionsToValidate
      collections={mockCollections}
      handleValidateCollectionList={handleValidateCollectionList}
      {...props}
    />,
  );
  return { handleValidateCollectionList };
};

describe("CollectionsToValidate", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      renderComponent({ collections: [] });
    });

    it("renders collections in the list", () => {
      renderComponent();

      expect(screen.getByText("Collection A")).toBeInTheDocument();
      expect(screen.getByText("Collection B")).toBeInTheDocument();
      expect(screen.getByText("Collection C")).toBeInTheDocument();
    });

    it("renders the page title", () => {
      renderComponent();

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Publication of the provisional collections",
      );
    });

    it("renders the panel titles", () => {
      renderComponent();

      expectPanelTitles("Provisional collections (3)", "Collections to publish (0)");
    });

    it("renders return button with correct link", () => {
      renderComponent();

      expectBackLinkTo("/concepts/collections");
    });
  });

  describe("Empty state", () => {
    it("renders empty list without errors", () => {
      renderComponent({ collections: [] });

      expect(screen.queryByText("Collection A")).not.toBeInTheDocument();
    });
  });

  describe("Item selection", () => {
    it("moves a collection to the panel of collections to publish", () => {
      renderComponent();

      pick("Collection A");

      expect(optionLabels(toPublishList())).toEqual(["Collection A"]);
      expect(optionLabels(availableList())).toEqual(["Collection B", "Collection C"]);
    });

    it("publishes every selected collection", () => {
      const { handleValidateCollectionList } = renderComponent();

      pick("Collection A");
      pick("Collection B");
      fireEvent.click(screen.getByRole("button", { name: "Publish" }));

      expect(handleValidateCollectionList).toHaveBeenCalledWith(["1", "2"]);
    });

    it("warns when no collection is selected", () => {
      const { handleValidateCollectionList } = renderComponent();

      fireEvent.click(screen.getByRole("button", { name: "Publish" }));

      expect(screen.getByText("Add at least one collection to publish")).toBeInTheDocument();
      expect(handleValidateCollectionList).not.toHaveBeenCalled();
    });
  });

  describe("Server-side error", () => {
    it("displays the error reported by the back-office", () => {
      renderComponent({ serverSideError: "The publication failed" });

      expect(screen.getByRole("alert")).toHaveTextContent("The publication failed");
    });

    it("displays no error when the back-office reported none", () => {
      renderComponent({ serverSideError: "" });

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("renders publish button", () => {
      renderComponent();

      expect(screen.getByText("Publish")).toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    it("has a filter input on each panel", () => {
      renderComponent();

      expectFilterOnEachPanel();
    });

    it("filters the available collections on their label", () => {
      renderComponent();

      filterSource("Collection A");

      expect(optionLabels(availableList())).toEqual(["Collection A"]);
    });
  });
});
