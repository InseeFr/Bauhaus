import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { expectAllPropsForwardedToStampsInput } from "../stamps-input/stamps-input.testing";
import { ContributorsInput } from "./contributors-input";

vi.mock("../stamps-input/stamps-input", async () => ({
  StampsInput: (await import("../stamps-input/stamps-input.testing")).StampsInputMock,
}));

describe("ContributorsInput", () => {
  it("renders StampsInput with contributor labels for first lang", () => {
    const mockOnChange = vi.fn();
    render(
      <ContributorsInput value="contributor1" onChange={mockOnChange} lang="first" multi={false} />,
    );

    const stampsInput = screen.getByTestId("stamps-input");
    expect(stampsInput).toBeInTheDocument();
    expect(screen.getByTestId("lang")).toHaveTextContent("first");
  });

  it("renders StampsInput with contributor labels for default lang", () => {
    const mockOnChange = vi.fn();
    render(
      <ContributorsInput
        value="contributor1"
        onChange={mockOnChange}
        lang="default"
        multi={false}
      />,
    );

    const stampsInput = screen.getByTestId("stamps-input");
    expect(stampsInput).toBeInTheDocument();
    expect(screen.getByTestId("lang")).toHaveTextContent("default");
  });

  it("forwards all props to StampsInput", () => {
    expectAllPropsForwardedToStampsInput(ContributorsInput, ["contributor1", "contributor2"]);
  });

  it("handles empty value", () => {
    const mockOnChange = vi.fn();
    render(<ContributorsInput value="" onChange={mockOnChange} lang="first" multi={false} />);

    expect(screen.getByTestId("stamps-input")).toBeInTheDocument();
  });

  it("uses same label for single and multi mode", () => {
    const mockOnChange = vi.fn();
    render(
      <ContributorsInput
        value={["contributor1"]}
        onChange={mockOnChange}
        lang="first"
        multi={true}
      />,
    );

    const labels = screen.getAllByText("Contributors");
    expect(labels).toHaveLength(2);

    const labelMulti = screen.getByTestId("label-multi");
    expect(labelMulti.textContent).toBe("Contributors");
  });
});
