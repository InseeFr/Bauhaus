import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { NumericRepresentation as NumericRepresentationType } from "../../types/api";
import { NumericRepresentation } from "./NumericRepresentation";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.numeric.type": "Type",
        "physicalInstance.view.numeric.min": "Valeur minimale",
        "physicalInstance.view.numeric.max": "Valeur maximale",
        "physicalInstance.view.numeric.addMinBound": "Ajouter une borne minimale",
        "physicalInstance.view.numeric.addMaxBound": "Ajouter une borne maximale",
        "physicalInstance.view.delete": "Supprimer",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, type, ...props }: any) => (
    <input id={id} type={type} value={value} onChange={onChange} {...props} />
  ),
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ id, value, onChange, options }: any) => (
    <select id={id} value={value} onChange={(e) => onChange({ value: e.target.value })}>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick, type }: any) => (
    <button type={type} onClick={onClick}>
      {label}
    </button>
  ),
}));

describe("NumericRepresentation", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const lastRepresentation = (): NumericRepresentationType => mockOnChange.mock.calls.at(-1)![0];

  it("should keep the decimal part of a minimum bound", () => {
    render(<NumericRepresentation representation={undefined} onChange={mockOnChange} />);
    fireEvent.click(screen.getByText("Ajouter une borne minimale"));

    fireEvent.change(screen.getByLabelText("Valeur minimale"), { target: { value: "1.5" } });

    expect(lastRepresentation().NumberRange?.Low?.value).toBe(1.5);
  });

  it("should keep the decimal part of a maximum bound", () => {
    render(<NumericRepresentation representation={undefined} onChange={mockOnChange} />);
    fireEvent.click(screen.getByText("Ajouter une borne maximale"));

    fireEvent.change(screen.getByLabelText("Valeur maximale"), { target: { value: "99.99" } });

    expect(lastRepresentation().NumberRange?.High?.value).toBe(99.99);
  });

  it("should not block the enclosing form when the bounds are decimal", () => {
    const { container } = render(
      <form>
        <NumericRepresentation representation={undefined} onChange={mockOnChange} />
      </form>,
    );
    fireEvent.click(screen.getByText("Ajouter une borne minimale"));
    fireEvent.click(screen.getByText("Ajouter une borne maximale"));

    fireEvent.change(screen.getByLabelText("Valeur minimale"), { target: { value: "-0.5" } });
    fireEvent.change(screen.getByLabelText("Valeur maximale"), { target: { value: "1.25" } });

    expect(container.querySelector("form")!.checkValidity()).toBe(true);
  });

  it("should display a decimal bound coming from the representation", () => {
    render(
      <NumericRepresentation
        representation={{
          $type: "NumericRepresentationBaseType",
          NumericTypeCode: "Decimal",
          NumberRange: {
            Low: { IsInclusive: true, value: 0.1 },
            High: { IsInclusive: true, value: 12.34 },
          },
        }}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByLabelText("Valeur minimale")).toHaveValue(0.1);
    expect(screen.getByLabelText("Valeur maximale")).toHaveValue(12.34);
  });
});
