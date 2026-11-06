import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AddButton } from "./add";

describe("AddButton", () => {
  it("renders an icon-only PrimeReact button named Add", () => {
    render(<AddButton onClick={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Add" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("p-button", "p-button-icon-only");
    expect(button).not.toHaveClass("btn");
    expect(button.querySelector(".pi-plus")).not.toBeNull();
  });

  it("calls the onClick handler and passes the other props", () => {
    const handleClick = vi.fn();
    render(<AddButton id="add-code" data-component-id="c1" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Add" });
    expect(button).toHaveAttribute("id", "add-code");
    expect(button.dataset.componentId).toBe("c1");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
