import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { expectAllPropsForwardedToStampsInput } from "../stamps-input/stamps-input.testing";
import { CreatorsInput } from "./index";

vi.mock("../stamps-input/stamps-input", async () => ({
  StampsInput: (await import("../stamps-input/stamps-input.testing")).StampsInputMock,
}));

describe("CreatorsInput", () => {
  it("renders StampsInput with creator labels for first lang", () => {
    const mockOnChange = vi.fn();
    render(<CreatorsInput value="creator1" onChange={mockOnChange} lang="first" multi={false} />);

    const stampsInput = screen.getByTestId("stamps-input");
    expect(stampsInput).toBeInTheDocument();
    expect(screen.getByTestId("lang")).toHaveTextContent("first");
  });

  it("renders StampsInput with creator labels for default lang", () => {
    const mockOnChange = vi.fn();
    render(<CreatorsInput value="creator1" onChange={mockOnChange} lang="default" multi={false} />);

    const stampsInput = screen.getByTestId("stamps-input");
    expect(stampsInput).toBeInTheDocument();
    expect(screen.getByTestId("lang")).toHaveTextContent("default");
  });

  it("forwards all props to StampsInput", () => {
    expectAllPropsForwardedToStampsInput(CreatorsInput, ["creator1", "creator2"]);
  });

  it("handles empty value", () => {
    const mockOnChange = vi.fn();
    render(<CreatorsInput value="" onChange={mockOnChange} lang="first" multi={false} />);

    expect(screen.getByTestId("stamps-input")).toBeInTheDocument();
  });
});
