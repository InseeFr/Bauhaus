import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PublishersInput } from "./PublishersInput";

vi.mock("../../i18n/build-dictionary", () => ({
  D1: {
    organisation: "Organisation publiante",
  },
}));

vi.mock("../../components/business/stamps-input/stamps-input", () => ({
  OrganisationInput: ({ value, onChange, multi, labelSingle, labelMulti }: any) => (
    <div data-testid="organisation-input">
      <div data-testid="value">{JSON.stringify(value)}</div>
      <div data-testid="multi">{String(multi)}</div>
      <div data-testid="label-single">{labelSingle}</div>
      <div data-testid="label-multi">{labelMulti}</div>
      <button
        onClick={() =>
          onChange(["http://bauhaus/organisations/X", "http://bauhaus/organisations/Y"])
        }
      >
        change
      </button>
    </div>
  ),
}));

describe("PublishersInput", () => {
  it("renders OrganisationInput in multi mode and forwards an IRI list as value", () => {
    const onChange = vi.fn();
    render(
      <PublishersInput
        value={["http://bauhaus/organisations/A", "http://bauhaus/organisations/B"]}
        onChange={onChange}
      />,
    );

    expect(screen.getByTestId("organisation-input")).toBeInTheDocument();
    expect(screen.getByTestId("multi")).toHaveTextContent("true");
    expect(screen.getByTestId("value")).toHaveTextContent(
      '["http://bauhaus/organisations/A","http://bauhaus/organisations/B"]',
    );
  });

  it("emits a flat list of IRIs (no {id: ...} wrapping)", () => {
    const onChange = vi.fn();
    render(<PublishersInput value={[]} onChange={onChange} />);

    screen.getByText("change").click();

    expect(onChange).toHaveBeenCalledWith([
      "http://bauhaus/organisations/X",
      "http://bauhaus/organisations/Y",
    ]);
  });
});
