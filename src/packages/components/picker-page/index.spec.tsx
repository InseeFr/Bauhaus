import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Picker } from "./index";

const mockItems = [
  { id: "1", label: "First Item" },
  { id: "2", label: "Second Item" },
  { id: "3", label: "Third Item" },
];

const MockValidationButton = ({
  action,
  disabled,
}: {
  action: () => void;
  disabled: boolean;
  selectedIds: string[];
}) => (
  <button onClick={action} disabled={disabled} data-testid="validation-button">
    Validate
  </button>
);

const defaultProps = {
  items: mockItems,
  handleAction: vi.fn(),
  title: "Test Title",
  panelTitle: "Selected Items",
  labelWarning: "Please select at least one item",
  context: "test-context",
  ValidationButton: MockValidationButton,
};

const renderPicker = (props = {}) => {
  return render(
    <MemoryRouter>
      <Picker {...defaultProps} {...props} />
    </MemoryRouter>,
  );
};

describe("Picker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the page title", () => {
      renderPicker();
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders the panel title", () => {
      renderPicker();
      expect(screen.getByText("Selected Items")).toBeInTheDocument();
    });

    it("renders all items in the list to add", () => {
      renderPicker();
      expect(screen.getByText("First Item")).toBeInTheDocument();
      expect(screen.getByText("Second Item")).toBeInTheDocument();
      expect(screen.getByText("Third Item")).toBeInTheDocument();
    });

    it("renders search input", () => {
      renderPicker();
      const searchInput = screen.getByRole("textbox");
      expect(searchInput).toBeInTheDocument();
    });

    it("renders validation button", () => {
      renderPicker();
      expect(screen.getByTestId("validation-button")).toBeInTheDocument();
    });

    it("renders return button with correct link", () => {
      renderPicker();
      const returnButton = screen.getByRole("link");
      expect(returnButton).toHaveAttribute("href", "/test-context");
    });

    it("renders disabled warning message when disabled", () => {
      renderPicker({
        disabled: true,
        disabledWarningMessage: "This picker is disabled",
      });
      expect(screen.getByText("This picker is disabled")).toBeInTheDocument();
    });

    it("does not render disabled warning message when not disabled", () => {
      renderPicker({
        disabled: false,
        disabledWarningMessage: "This picker is disabled",
      });
      expect(screen.queryByText("This picker is disabled")).not.toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    it("filters items based on search input", () => {
      renderPicker();
      const searchInput = screen.getByRole("textbox");

      fireEvent.change(searchInput, { target: { value: "First" } });

      expect(screen.getByText("First Item")).toBeInTheDocument();
      expect(screen.queryByText("Second Item")).not.toBeInTheDocument();
      expect(screen.queryByText("Third Item")).not.toBeInTheDocument();
    });

    it("filters items case insensitively", () => {
      renderPicker();
      const searchInput = screen.getByRole("textbox");

      fireEvent.change(searchInput, { target: { value: "first" } });

      expect(screen.getByText("First Item")).toBeInTheDocument();
    });

    it("shows all items when search is cleared", () => {
      renderPicker();
      const searchInput = screen.getByRole("textbox");

      fireEvent.change(searchInput, { target: { value: "First" } });
      fireEvent.change(searchInput, { target: { value: "" } });

      expect(screen.getByText("First Item")).toBeInTheDocument();
      expect(screen.getByText("Second Item")).toBeInTheDocument();
      expect(screen.getByText("Third Item")).toBeInTheDocument();
    });

    it("handles items with accented characters", () => {
      const itemsWithAccents = [
        { id: "1", label: "Élément" },
        { id: "2", label: "Café" },
      ];
      renderPicker({ items: itemsWithAccents });
      const searchInput = screen.getByRole("textbox");

      fireEvent.change(searchInput, { target: { value: "element" } });

      expect(screen.getByText("Élément")).toBeInTheDocument();
    });
  });

  describe("Adding items", () => {
    it("moves item to added panel when clicked", () => {
      renderPicker();

      const firstItem = screen.getByText("First Item");
      fireEvent.click(firstItem);

      const panels = screen.getAllByText("First Item");
      expect(panels).toHaveLength(1);
    });
  });

  describe("Removing items", () => {
    it("moves item back to available list when removed", () => {
      renderPicker();

      const firstItem = screen.getByText("First Item");
      fireEvent.click(firstItem);

      const addedItem = screen.getByText("First Item");
      fireEvent.click(addedItem);

      expect(screen.getByText("First Item")).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("renders validation button", () => {
      renderPicker();

      const validationButton = screen.getByTestId("validation-button");
      expect(validationButton).toBeInTheDocument();
    });

    it("calls handleAction with selected ids when validation button is clicked", () => {
      const handleAction = vi.fn();
      renderPicker({ handleAction });

      const firstItem = screen.getByText("First Item");
      fireEvent.click(firstItem);

      const validationButton = screen.getByTestId("validation-button");
      fireEvent.click(validationButton);

      expect(handleAction).toHaveBeenCalledWith(["1"]);
    });
  });

  describe("Edge cases", () => {
    it("handles empty items array", () => {
      renderPicker({ items: [] });
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("handles undefined items", () => {
      renderPicker({ items: undefined });
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("handles null items", () => {
      renderPicker({ items: null });
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("handles items with undefined labels", () => {
      const itemsWithUndefinedLabel = [
        { id: "1", label: undefined },
        { id: "2", label: "Valid Label" },
      ];
      renderPicker({ items: itemsWithUndefinedLabel });
      expect(screen.getByText("Valid Label")).toBeInTheDocument();
    });
  });
});
