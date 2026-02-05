import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

import { Controls } from "./controls";

vi.mock("../../../components/action-toolbar", () => ({
  ActionToolbar: vi.fn(({ children }) => <div data-testid="action-toolbar">{children}</div>),
}));

vi.mock("../../../components/buttons/buttons-with-icons", () => ({
  CancelButton: vi.fn(({ action }) => (
    <button type="button" data-testid="cancel-button" data-action={action}>
      Cancel
    </button>
  )),
  SaveButton: vi.fn(({ action, disabled }) => (
    <button type="button" data-testid="save-button" onClick={action} disabled={disabled}>
      Save
    </button>
  )),
}));

describe("Controls Component", () => {
  it("renders CancelButton and SaveButton inside ActionToolbar", () => {
    const mockOnSubmit = vi.fn();

    render(<Controls onSubmit={mockOnSubmit} disabled={false} />);

    screen.getByTestId("action-toolbar");

    const cancelButton = screen.getByTestId("cancel-button");
    expect(cancelButton.getAttribute("data-action")).toBe("/operations/operations");

    const saveButton = screen.getByTestId("save-button");
    expect(saveButton.getAttribute("disabled")).toBeNull();
  });

  it("calls onSubmit when SaveButton is clicked", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<Controls onSubmit={mockOnSubmit} disabled={false} />);

    const saveButton = screen.getByTestId("save-button");

    await user.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledOnce();
  });

  it("disables SaveButton when disabled prop is true", () => {
    const mockOnSubmit = vi.fn();

    render(<Controls onSubmit={mockOnSubmit} disabled={true} />);

    const saveButton = screen.getByTestId("save-button");
    expect(saveButton.getAttribute("disabled")).toBeDefined();
  });
});
