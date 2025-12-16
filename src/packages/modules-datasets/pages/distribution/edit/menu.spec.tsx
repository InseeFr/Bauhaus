import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Menu } from "./menu";

const mockUseGoBack = vi.fn();

vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: () => mockUseGoBack,
}));

describe("Menu", () => {
  it("should render cancel and save buttons", () => {
    const mockOnSave = vi.fn();

    render(<Menu onSave={mockOnSave} />);

    expect(screen.getByRole("button", { name: /cancel/i })).not.toBeNull();
    expect(screen.getByRole("button", { name: /save/i })).not.toBeNull();
  });

  it("should call goBack with correct path when cancel button is clicked", () => {
    const mockOnSave = vi.fn();

    render(<Menu onSave={mockOnSave} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockUseGoBack).toHaveBeenCalledWith("/datasets/distributions");
  });

  it("should call onSave when save button is clicked", () => {
    const mockOnSave = vi.fn();

    render(<Menu onSave={mockOnSave} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("should disable save button when isSaveDisabled is true", () => {
    const mockOnSave = vi.fn();

    render(<Menu onSave={mockOnSave} isSaveDisabled={true} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it("should enable save button when isSaveDisabled is false", () => {
    const mockOnSave = vi.fn();

    render(<Menu onSave={mockOnSave} isSaveDisabled={false} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).not.toBeDisabled();
  });

  it("should enable save button by default when isSaveDisabled is not provided", () => {
    const mockOnSave = vi.fn();

    render(<Menu onSave={mockOnSave} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).not.toBeDisabled();
  });
});
