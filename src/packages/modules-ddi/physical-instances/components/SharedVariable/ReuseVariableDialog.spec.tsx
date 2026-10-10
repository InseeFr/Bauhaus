import { fireEvent, render, screen } from "@testing-library/react";
import { type ChangeEvent, useCallback } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Variable } from "../../types/api";
import { ReuseVariableDialog } from "./ReuseVariableDialog";

vi.mock("react-i18next", () => import("../../../i18n.testing"));

const mockUseStudyUnitVariables = vi.fn();
vi.mock("../../../hooks/useStudyUnitVariables", () => ({
  useStudyUnitVariables: (...args: unknown[]) => mockUseStudyUnitVariables(...args),
}));

vi.mock("primereact/dialog", () => ({
  Dialog: ({ visible, children, header, footer }: any) =>
    visible ? (
      <dialog open aria-label={header}>
        {children}
        {footer}
      </dialog>
    ) : null,
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ value, options, onChange, emptyMessage, "aria-label": ariaLabel }: any) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLSelectElement>) => onChange({ value: e.target.value || null }),
      [onChange],
    );
    return (
      <>
        <select aria-label={ariaLabel} value={value || ""} onChange={handleChange}>
          <option value="">-</option>
          {options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {options.length === 0 && <p>{emptyMessage}</p>}
      </>
    );
  },
}));

const fr = (value: string) => [{ "@language": "fr-FR", "@value": value }];

const variable = (id: string, name: string, label: string): Variable =>
  ({
    $type: "Variable",
    Agency: "fr.insee",
    ID: id,
    Version: "3",
    VariableName: fr(name),
    Label: fr(label),
  }) as Variable;

const sexe = variable("var-sexe", "SEXE", "Sexe");
const age = variable("var-age", "AGE", "Âge");

const studyUnit = { agency: "fr.insee", id: "su-1" };
const NO_EXCLUDED_VARIABLE_IDS: string[] = [];

const SELECT = "physicalInstance.view.reuseVariable.select";
const CONFIRM = "physicalInstance.view.reuseVariable.confirm";

const renderDialog = (props: Partial<Parameters<typeof ReuseVariableDialog>[0]> = {}) => {
  const onReuse = vi.fn();
  const onHide = vi.fn();
  render(
    <ReuseVariableDialog
      studyUnit={studyUnit}
      excludedVariableIds={NO_EXCLUDED_VARIABLE_IDS}
      onReuse={onReuse}
      onHide={onHide}
      {...props}
    />,
  );
  return { onReuse, onHide };
};

describe("ReuseVariableDialog", () => {
  beforeEach(() => {
    mockUseStudyUnitVariables.mockReturnValue({ data: [sexe, age], isLoading: false });
  });

  it("should search the variables of the study unit variable scheme", () => {
    renderDialog();

    expect(mockUseStudyUnitVariables).toHaveBeenCalledWith("fr.insee", "su-1");
    expect(screen.getByRole("option", { name: "SEXE — Sexe" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "AGE — Âge" })).toBeInTheDocument();
  });

  it("should not offer the variables the physical instance already uses", () => {
    renderDialog({ excludedVariableIds: ["var-sexe"] });

    expect(screen.queryByRole("option", { name: "SEXE — Sexe" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "AGE — Âge" })).toBeInTheDocument();
  });

  it("should hand the chosen Variable item over unchanged", () => {
    const { onReuse } = renderDialog();

    fireEvent.change(screen.getByLabelText(SELECT), { target: { value: "fr.insee/var-age" } });
    fireEvent.click(screen.getByRole("button", { name: CONFIRM }));

    expect(onReuse).toHaveBeenCalledWith(age);
  });

  it("should not reuse anything until a variable is chosen", () => {
    renderDialog();

    expect(screen.getByRole("button", { name: CONFIRM })).toBeDisabled();
  });

  it("should say so when the study unit has no other variable to reuse", () => {
    renderDialog({ excludedVariableIds: ["var-sexe", "var-age"] });

    expect(screen.getByText("physicalInstance.view.reuseVariable.empty")).toBeInTheDocument();
  });
});
