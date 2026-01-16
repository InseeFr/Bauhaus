import { describe, it, expect } from "vitest";
import {
  codeRepresentationReducer,
  initialState,
  CodeRepresentationState,
  CodeRepresentationAction,
} from "./CodeRepresentation.reducer";
import type { CodeTableRow } from "./CodeListDataTable";

describe("codeRepresentationReducer", () => {
  const mockCode: CodeTableRow = {
    id: "code-1",
    value: "1",
    label: "Label 1",
    categoryId: "category-1",
  };

  const stateWithCodes: CodeRepresentationState = {
    ...initialState,
    codes: [mockCode],
    codeListLabel: "Test Label",
  };

  describe("SET_CODE_LIST_LABEL", () => {
    it("should update codeListLabel", () => {
      const action: CodeRepresentationAction = {
        type: "SET_CODE_LIST_LABEL",
        payload: "New Label",
      };

      const result = codeRepresentationReducer(initialState, action);

      expect(result.codeListLabel).toBe("New Label");
    });
  });

  describe("SET_CODES", () => {
    it("should replace all codes", () => {
      const newCodes: CodeTableRow[] = [
        { id: "new-1", value: "A", label: "Label A", categoryId: "cat-a" },
        { id: "new-2", value: "B", label: "Label B", categoryId: "cat-b" },
      ];
      const action: CodeRepresentationAction = {
        type: "SET_CODES",
        payload: newCodes,
      };

      const result = codeRepresentationReducer(stateWithCodes, action);

      expect(result.codes).toEqual(newCodes);
      expect(result.codes).toHaveLength(2);
    });
  });

  describe("ADD_CODE", () => {
    it("should add a new code to the list", () => {
      const newCode: CodeTableRow = {
        id: "code-2",
        value: "2",
        label: "Label 2",
        categoryId: "category-2",
      };
      const action: CodeRepresentationAction = {
        type: "ADD_CODE",
        payload: newCode,
      };

      const result = codeRepresentationReducer(stateWithCodes, action);

      expect(result.codes).toHaveLength(2);
      expect(result.codes[1]).toEqual(newCode);
    });
  });

  describe("UPDATE_CODE", () => {
    it("should update the value field of a code", () => {
      const action: CodeRepresentationAction = {
        type: "UPDATE_CODE",
        payload: { id: "code-1", field: "value", value: "updated-value" },
      };

      const result = codeRepresentationReducer(stateWithCodes, action);

      expect(result.codes[0].value).toBe("updated-value");
      expect(result.codes[0].label).toBe("Label 1");
    });

    it("should update the label field of a code", () => {
      const action: CodeRepresentationAction = {
        type: "UPDATE_CODE",
        payload: { id: "code-1", field: "label", value: "Updated Label" },
      };

      const result = codeRepresentationReducer(stateWithCodes, action);

      expect(result.codes[0].label).toBe("Updated Label");
      expect(result.codes[0].value).toBe("1");
    });

    it("should not modify other codes", () => {
      const stateWithMultipleCodes: CodeRepresentationState = {
        ...initialState,
        codes: [mockCode, { id: "code-2", value: "2", label: "Label 2", categoryId: "category-2" }],
      };
      const action: CodeRepresentationAction = {
        type: "UPDATE_CODE",
        payload: { id: "code-1", field: "value", value: "updated" },
      };

      const result = codeRepresentationReducer(stateWithMultipleCodes, action);

      expect(result.codes[1]).toEqual(stateWithMultipleCodes.codes[1]);
    });
  });

  describe("DELETE_CODE", () => {
    it("should remove the code with the given id", () => {
      const action: CodeRepresentationAction = {
        type: "DELETE_CODE",
        payload: "code-1",
      };

      const result = codeRepresentationReducer(stateWithCodes, action);

      expect(result.codes).toHaveLength(0);
    });

    it("should not remove codes with different ids", () => {
      const action: CodeRepresentationAction = {
        type: "DELETE_CODE",
        payload: "non-existent",
      };

      const result = codeRepresentationReducer(stateWithCodes, action);

      expect(result.codes).toHaveLength(1);
      expect(result.codes[0]).toEqual(mockCode);
    });
  });

  describe("SHOW_DATA_TABLE", () => {
    it("should set showDataTable to true and showReuseSelect to false", () => {
      const stateWithReuseSelect: CodeRepresentationState = {
        ...initialState,
        showReuseSelect: true,
      };
      const action: CodeRepresentationAction = { type: "SHOW_DATA_TABLE" };

      const result = codeRepresentationReducer(stateWithReuseSelect, action);

      expect(result.showDataTable).toBe(true);
      expect(result.showReuseSelect).toBe(false);
    });
  });

  describe("SHOW_REUSE_SELECT", () => {
    it("should set showReuseSelect to true and showDataTable to false", () => {
      const stateWithDataTable: CodeRepresentationState = {
        ...initialState,
        showDataTable: true,
      };
      const action: CodeRepresentationAction = { type: "SHOW_REUSE_SELECT" };

      const result = codeRepresentationReducer(stateWithDataTable, action);

      expect(result.showReuseSelect).toBe(true);
      expect(result.showDataTable).toBe(false);
    });
  });

  describe("TOGGLE_REUSE_SELECT", () => {
    it("should toggle showReuseSelect from false to true", () => {
      const action: CodeRepresentationAction = { type: "TOGGLE_REUSE_SELECT" };

      const result = codeRepresentationReducer(initialState, action);

      expect(result.showReuseSelect).toBe(true);
      expect(result.showDataTable).toBe(false);
    });

    it("should toggle showReuseSelect from true to false", () => {
      const stateWithReuseSelect: CodeRepresentationState = {
        ...initialState,
        showReuseSelect: true,
      };
      const action: CodeRepresentationAction = { type: "TOGGLE_REUSE_SELECT" };

      const result = codeRepresentationReducer(stateWithReuseSelect, action);

      expect(result.showReuseSelect).toBe(false);
    });

    it("should set showDataTable to false when toggling", () => {
      const stateWithDataTable: CodeRepresentationState = {
        ...initialState,
        showDataTable: true,
      };
      const action: CodeRepresentationAction = { type: "TOGGLE_REUSE_SELECT" };

      const result = codeRepresentationReducer(stateWithDataTable, action);

      expect(result.showDataTable).toBe(false);
    });
  });

  describe("SET_SELECTED_CODE_LIST_ID", () => {
    it("should update selectedCodeListId", () => {
      const action: CodeRepresentationAction = {
        type: "SET_SELECTED_CODE_LIST_ID",
        payload: "selected-list-id",
      };

      const result = codeRepresentationReducer(initialState, action);

      expect(result.selectedCodeListId).toBe("selected-list-id");
    });

    it("should allow setting to null", () => {
      const stateWithSelection: CodeRepresentationState = {
        ...initialState,
        selectedCodeListId: "some-id",
      };
      const action: CodeRepresentationAction = {
        type: "SET_SELECTED_CODE_LIST_ID",
        payload: null,
      };

      const result = codeRepresentationReducer(stateWithSelection, action);

      expect(result.selectedCodeListId).toBeNull();
    });
  });

  describe("INIT_FROM_CODE_LIST", () => {
    it("should initialize state from code list data", () => {
      const codes: CodeTableRow[] = [
        { id: "c1", value: "V1", label: "L1", categoryId: "cat1" },
        { id: "c2", value: "V2", label: "L2", categoryId: "cat2" },
      ];
      const action: CodeRepresentationAction = {
        type: "INIT_FROM_CODE_LIST",
        payload: {
          label: "Initialized Label",
          codes,
          showDataTable: true,
        },
      };

      const result = codeRepresentationReducer(initialState, action);

      expect(result.codeListLabel).toBe("Initialized Label");
      expect(result.codes).toEqual(codes);
      expect(result.showDataTable).toBe(true);
    });

    it("should set showDataTable to false when no codes", () => {
      const action: CodeRepresentationAction = {
        type: "INIT_FROM_CODE_LIST",
        payload: {
          label: "Empty List",
          codes: [],
          showDataTable: false,
        },
      };

      const result = codeRepresentationReducer(initialState, action);

      expect(result.showDataTable).toBe(false);
      expect(result.codes).toEqual([]);
    });
  });

  describe("initialState", () => {
    it("should have correct default values", () => {
      expect(initialState).toEqual({
        codeListLabel: "",
        codes: [],
        showDataTable: false,
        showReuseSelect: false,
        selectedCodeListId: null,
      });
    });
  });

  describe("unknown action", () => {
    it("should return current state for unknown action", () => {
      const action = { type: "UNKNOWN_ACTION" } as unknown as CodeRepresentationAction;

      const result = codeRepresentationReducer(stateWithCodes, action);

      expect(result).toEqual(stateWithCodes);
    });
  });
});
