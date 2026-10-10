import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

const EXTRA_CLASSES = ["extra"];

describe("Button", () => {
  it("renders a PrimeReact button calling the handler action", () => {
    const action = vi.fn<() => void>();
    render(<Button action={action}>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("p-button", "bauhaus-btn");
    expect(button).not.toHaveClass("btn");

    fireEvent.click(button);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("renders a disabled PrimeReact button that ignores clicks", () => {
    const action = vi.fn<() => void>();
    render(<Button action={action} label="Save" disabled />);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(action).not.toHaveBeenCalled();
  });

  it("passes the remaining props to the button element", () => {
    render(<Button action={vi.fn<() => void>()} label="Save" data-testid="save" />);

    expect(screen.getByTestId("save")).toHaveTextContent("Save");
  });

  it("renders an internal link styled as a PrimeReact button for a URL action", () => {
    render(
      <MemoryRouter>
        <Button action="/concepts" label="Back" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/concepts");
    expect(link).toHaveClass("p-button", "bauhaus-btn");
    expect(link).not.toHaveClass("btn");
  });

  it("renders an external link styled as a PrimeReact button", () => {
    render(<Button action="https://www.insee.fr" externalLink label="Insee" />);

    const link = screen.getByRole("link", { name: "Insee" });
    expect(link).toHaveAttribute("href", "https://www.insee.fr");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveClass("p-button", "bauhaus-btn");
    expect(link).not.toHaveClass("btn");
  });

  it("adds the extra classes", () => {
    render(<Button action={vi.fn<() => void>()} label="Save" classes={EXTRA_CLASSES} />);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("p-button", "extra");
  });
});
