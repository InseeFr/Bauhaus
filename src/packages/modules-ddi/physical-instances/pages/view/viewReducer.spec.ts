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

describe("viewReducer — date de dernière modification des variables locales", () => {
  it("should record the modification date carried by a reported edit", () => {
    const next = viewReducer(
      initialState,
      actions.updateVariable(variable("var-1"), "2026-11-08T10:00:00.000Z"),
    );

    expect(next.lastModifiedById).toEqual({ "var-1": "2026-11-08T10:00:00.000Z" });
  });

  it("should record the modification date of an added variable", () => {
    const next = viewReducer(
      initialState,
      actions.addVariable(variable("var-2"), "var-1", "2026-11-08T10:00:00.000Z"),
    );

    expect(next.lastModifiedById).toEqual({ "var-2": "2026-11-08T10:00:00.000Z" });
  });

  it("should record the modification date of a variable being created", () => {
    const next = viewReducer(
      initialState,
      actions.addEditedVariable(variable("uuid-1"), "2026-11-08T10:00:00.000Z"),
    );

    expect(next.lastModifiedById).toEqual({ "uuid-1": "2026-11-08T10:00:00.000Z" });
  });

  it("should stamp the edit with the current date by default", () => {
    const before = new Date().toISOString();

    const next = viewReducer(initialState, actions.updateVariable(variable("var-1")));

    expect(next.lastModifiedById["var-1"] >= before).toBe(true);
  });

  it("should forget the modification date of a deleted variable", () => {
    const edited = viewReducer(
      initialState,
      actions.updateVariable(variable("var-1"), "2026-11-08T10:00:00.000Z"),
    );

    const next = viewReducer(edited, actions.deleteVariable("var-1"));

    expect(next.lastModifiedById).toEqual({});
  });

  it("should forget every modification date when local variables are cleared", () => {
    const edited = viewReducer(
      initialState,
      actions.updateVariable(variable("var-1"), "2026-11-08T10:00:00.000Z"),
    );

    const next = viewReducer(edited, actions.clearLocalVariables());

    expect(next.lastModifiedById).toEqual({});
  });
});
