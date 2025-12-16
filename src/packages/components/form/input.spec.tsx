import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { TextInputBlock, UrlInputBlock, NumberInputBlock } from "./input";

describe("Input Blocks", () => {
  it("renders TextInputBlock correctly", () => {
    render(<TextInputBlock label="Username" />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("renders UrlInputBlock correctly", () => {
    render(<UrlInputBlock label="Website" />);
    expect(screen.getByLabelText("Website")).toBeInTheDocument();
  });

  it("renders NumberInputBlock correctly", () => {
    render(<NumberInputBlock label="Age" />);
    expect(screen.getByLabelText("Age")).toBeInTheDocument();
  });

  it("displays error message when error prop is set", () => {
    render(<TextInputBlock label="Username" error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("marks input as invalid when error is present", () => {
    render(<TextInputBlock label="Username" error="Invalid input" />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders required label when required prop is set", () => {
    render(<TextInputBlock label="Username" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates input with error message via aria-describedby", () => {
    render(<TextInputBlock label="Username" error="Invalid input" />);
    const input = screen.getByLabelText("Username");
    const errorMessage = screen.getByText("Invalid input");

    expect(input).toHaveAttribute("aria-describedby", expect.stringMatching(/-error$/));
    expect(errorMessage).toBeInTheDocument();
  });

  it("allows user input in TextInputBlock", async () => {
    render(<TextInputBlock label="Username" />);
    const input = screen.getByLabelText("Username");

    await userEvent.type(input, "John Doe");
    expect(input).toHaveValue("John Doe");
  });
});
