import { fireEvent, render, screen, within } from "@testing-library/react";
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
  selectedIds,
}: {
  action: () => void;
  disabled: boolean;
  selectedIds: string[];
}) => (
  <button onClick={action} disabled={disabled} data-testid="validation-button">
    Validate ({selectedIds.join(",")})
  </button>
);

const defaultProps = {
  items: mockItems,
  handleAction: vi.fn(),
  title: "Test Title",
  panelTitle: "Selected Items",
  availablePanelTitle: "Available Items",
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

const availableList = () => screen.getAllByRole("listbox")[0];
const selectedList = () => screen.getAllByRole("listbox")[1];

const optionLabels = (list: HTMLElement) =>
  within(list)
    .queryAllByRole("option")
    .map((option) => option.textContent);

const pick = (label: string) => {
  fireEvent.click(within(availableList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
};

const unpick = (label: string) => {
  fireEvent.click(within(selectedList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Source" }));
};

describe("Picker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the page title", () => {
      renderPicker();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
    });

    it("renders the header of both panels", () => {
      renderPicker();
      expect(screen.getByText("Available Items")).toBeInTheDocument();
      expect(screen.getByText("Selected Items")).toBeInTheDocument();
    });

    it("resolves the panel headers with the size of each list", () => {
      renderPicker({
        availablePanelTitle: (size: number) => `Available (${size})`,
        panelTitle: (size: number) => `Selected (${size})`,
      });

      expect(screen.getByText("Available (3)")).toBeInTheDocument();
      expect(screen.getByText("Selected (0)")).toBeInTheDocument();
    });

    it("renders all items in the available list", () => {
      renderPicker();
      expect(optionLabels(availableList())).toEqual(["First Item", "Second Item", "Third Item"]);
    });

    it("starts with an empty selection", () => {
      renderPicker();
      expect(optionLabels(selectedList())).toEqual([]);
    });

    it("renders a filter input on each panel", () => {
      renderPicker();
      expect(screen.getAllByPlaceholderText("Label...")).toHaveLength(2);
    });

    it("renders validation button", () => {
      renderPicker();
      expect(screen.getByTestId("validation-button")).toBeInTheDocument();
    });

    it("renders return button with correct link", () => {
      renderPicker();
      expect(screen.getByText("Back").closest("a")).toHaveAttribute("href", "/test-context");
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

  describe("Filtering", () => {
    it("filters available items on their label", () => {
      renderPicker();

      fireEvent.input(screen.getAllByPlaceholderText("Label...")[0], {
        target: { value: "First" },
      });

      expect(optionLabels(availableList())).toEqual(["First Item"]);
    });

    it("shows every item again when the filter is cleared", () => {
      renderPicker();

      const filter = screen.getAllByPlaceholderText("Label...")[0];
      fireEvent.input(filter, { target: { value: "First" } });
      fireEvent.input(filter, { target: { value: "" } });

      expect(optionLabels(availableList())).toEqual(["First Item", "Second Item", "Third Item"]);
    });
  });

  describe("Selecting items", () => {
    it("moves an item to the selected panel", () => {
      renderPicker();

      pick("First Item");

      expect(optionLabels(selectedList())).toEqual(["First Item"]);
      expect(optionLabels(availableList())).toEqual(["Second Item", "Third Item"]);
    });

    it("moves an item back to the available panel", () => {
      renderPicker();

      pick("First Item");
      unpick("First Item");

      expect(optionLabels(selectedList())).toEqual([]);
      expect(optionLabels(availableList())).toContain("First Item");
    });

    it("exposes the selected ids to the validation button", () => {
      renderPicker();

      pick("Second Item");

      expect(screen.getByTestId("validation-button")).toHaveTextContent("Validate (2)");
    });
  });

  describe("Validation", () => {
    it("warns when nothing is selected", () => {
      const handleAction = vi.fn();
      renderPicker({ handleAction });

      fireEvent.click(screen.getByTestId("validation-button"));

      expect(screen.getByText("Please select at least one item")).toBeInTheDocument();
      expect(handleAction).not.toHaveBeenCalled();
    });

    it("clears the warning as soon as an item is selected", () => {
      renderPicker();

      fireEvent.click(screen.getByTestId("validation-button"));
      pick("First Item");

      expect(screen.queryByText("Please select at least one item")).not.toBeInTheDocument();
    });

    it("calls handleAction with selected ids when validation button is clicked", () => {
      const handleAction = vi.fn();
      renderPicker({ handleAction });

      pick("First Item");
      fireEvent.click(screen.getByTestId("validation-button"));

      expect(handleAction).toHaveBeenCalledWith(["1"]);
    });
  });

  describe("Edge cases", () => {
    it("handles empty items array", () => {
      renderPicker({ items: [] });
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
    });

    it("handles undefined items", () => {
      renderPicker({ items: undefined });
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
    });

    it("handles null items", () => {
      renderPicker({ items: null });
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
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
