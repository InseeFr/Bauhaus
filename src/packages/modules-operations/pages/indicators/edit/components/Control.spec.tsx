import { render, screen, fireEvent } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { useGoBack } from "@utils/hooks/useGoBack";

import { Control } from "./Control";

// Mock de useGoBack
vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: vi.fn(),
}));

const renderControl = (disabled = false) => {
  const mockGoBack = vi.fn();
  (useGoBack as Mock).mockReturnValue(mockGoBack);
  const mockOnSubmit = vi.fn();

  render(<Control onSubmit={mockOnSubmit} disabled={disabled} />);

  return { mockGoBack, mockOnSubmit };
};

describe("Control component", () => {
  it("renders CancelButton and SaveButton", () => {
    renderControl();

    screen.getByRole("button", { name: /cancel/i });
    screen.getByRole("button", { name: /save/i });
  });

  it("calls goBack with the correct path when CancelButton is clicked", () => {
    const { mockGoBack } = renderControl();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockGoBack).toHaveBeenCalledWith("/operations/indicators");
  });

  it("calls onSubmit when SaveButton is clicked", () => {
    const { mockOnSubmit } = renderControl();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("disables SaveButton when disabled prop is true", () => {
    renderControl(true);

    const input = screen.getByRole("button", { name: /save/i });
    expect(input.getAttribute("disabled")).not.toBeNull();
  });
});
