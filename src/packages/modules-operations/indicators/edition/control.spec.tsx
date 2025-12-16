import { render, screen, fireEvent } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { useGoBack } from "@utils/hooks/useGoBack";

import Control from "./control";

// Mock de useGoBack
vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: vi.fn(),
}));

describe("Control component", () => {
  it("renders CancelButton and SaveButton", () => {
    const mockGoBack = vi.fn();
    (useGoBack as Mock).mockReturnValue(mockGoBack);
    const mockOnSubmit = vi.fn();

    render(<Control onSubmit={mockOnSubmit} disabled={false} />);

    screen.getByRole("button", { name: /cancel/i });
    screen.getByRole("button", { name: /save/i });
  });

  it("calls goBack with the correct path when CancelButton is clicked", () => {
    const mockGoBack = vi.fn();
    (useGoBack as Mock).mockReturnValue(mockGoBack);
    const mockOnSubmit = vi.fn();

    render(<Control onSubmit={mockOnSubmit} disabled={false} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockGoBack).toHaveBeenCalledWith("/operations/indicators");
  });

  it("calls onSubmit when SaveButton is clicked", () => {
    const mockGoBack = vi.fn();
    (useGoBack as Mock).mockReturnValue(mockGoBack);
    const mockOnSubmit = vi.fn();

    render(<Control onSubmit={mockOnSubmit} disabled={false} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("disables SaveButton when disabled prop is true", () => {
    const mockGoBack = vi.fn();
    (useGoBack as Mock).mockReturnValue(mockGoBack);
    const mockOnSubmit = vi.fn();

    render(<Control onSubmit={mockOnSubmit} disabled={true} />);

    const input = screen.getByRole("button", { name: /save/i });
    expect(input.getAttribute("disabled")).not.toBeNull();
  });
});
