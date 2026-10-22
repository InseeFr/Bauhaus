import { render, screen } from "@testing-library/react";
import { useCallback } from "react";
import { describe, it, expect, vi } from "vitest";

import { PublishersInput } from "./PublishersInput";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "common.organization": "Organisation publiante",
      };
      return translations[key] ?? key;
    },
  }),
}));

vi.mock("../../components/business/stamps-input/stamps-input", () => ({
  OrganizationInput: ({ value, onChange, multi, labelSingle, labelMulti }: any) => {
    const change = useCallback(
      () => onChange(["http://bauhaus/organizations/X", "http://bauhaus/organizations/Y"]),
      [onChange],
    );
    return (
      <div data-testid="organization-input">
        <div data-testid="value">{JSON.stringify(value)}</div>
        <div data-testid="multi">{String(multi)}</div>
        <div data-testid="label-single">{labelSingle}</div>
        <div data-testid="label-multi">{labelMulti}</div>
        <button onClick={change}>change</button>
      </div>
    );
  },
}));

const publishers = ["http://bauhaus/organizations/A", "http://bauhaus/organizations/B"];
const NO_PUBLISHERS: string[] = [];

describe("PublishersInput", () => {
  it("renders OrganizationInput in multi mode and forwards an IRI list as value", () => {
    const onChange = vi.fn();
    render(<PublishersInput value={publishers} onChange={onChange} />);

    expect(screen.getByTestId("organization-input")).toBeInTheDocument();
    expect(screen.getByTestId("multi")).toHaveTextContent("true");
    expect(screen.getByTestId("value")).toHaveTextContent(
      '["http://bauhaus/organizations/A","http://bauhaus/organizations/B"]',
    );
  });

  it("emits a flat list of IRIs (no {id: ...} wrapping)", () => {
    const onChange = vi.fn();
    render(<PublishersInput value={NO_PUBLISHERS} onChange={onChange} />);

    screen.getByText("change").click();

    expect(onChange).toHaveBeenCalledWith([
      "http://bauhaus/organizations/X",
      "http://bauhaus/organizations/Y",
    ]);
  });
});
