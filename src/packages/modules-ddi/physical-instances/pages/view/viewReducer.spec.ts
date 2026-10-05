import { describe, expect, it } from "vitest";

import { actions, initialState, viewReducer, type VariableData } from "./viewReducer";

const variable = (id: string, label = "Libellé"): VariableData => ({
  id,
  label,
  name: `NAME_${id}`,
  type: "text",
});

describe("viewReducer — report des saisies du panneau (#1608)", () => {
  it("should keep the side panel on the variable whose edit is reported", () => {
    const state = { ...initialState, selectedVariable: variable("var-1") };

    const next = viewReducer(state, actions.updateVariable(variable("var-1", "Modifié")));

    expect(next.localVariables).toEqual([variable("var-1", "Modifié")]);
    expect(next.selectedVariable).toEqual(variable("var-1", "Modifié"));
  });

  it("should leave the side panel alone when another variable is reported", () => {
    const state = { ...initialState, selectedVariable: variable("var-2") };

    const next = viewReducer(state, actions.updateVariable(variable("var-1", "Modifié")));

    expect(next.selectedVariable).toEqual(variable("var-2"));
  });

  it("should ignore the edit of a deleted variable, reported when its panel closes", () => {
    const deleted = viewReducer(initialState, actions.deleteVariable("var-1"));

    const next = viewReducer(deleted, actions.updateVariable(variable("var-1", "Modifié")));

    expect(next.localVariables).toEqual([]);
  });

  it("should switch the side panel from the variable being created to the added one", () => {
    const state = { ...initialState, selectedVariable: variable("new") };

    const next = viewReducer(state, actions.addEditedVariable(variable("uuid-1")));

    expect(next.localVariables).toEqual([variable("uuid-1")]);
    expect(next.selectedVariable).toEqual(variable("uuid-1"));
  });

  it("should not reopen the side panel when the variable being created is reported on close", () => {
    const next = viewReducer(initialState, actions.addEditedVariable(variable("uuid-1")));

    expect(next.localVariables).toEqual([variable("uuid-1")]);
    expect(next.selectedVariable).toBeNull();
  });
});
