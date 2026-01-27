import type { CodeTableRow } from "./CodeListDataTable";

export interface CodeRepresentationState {
  codeListLabel: string;
  codes: CodeTableRow[];
  showDataTable: boolean;
  showReuseSelect: boolean;
  selectedCodeListId: string | null;
}

export type CodeRepresentationAction =
  | { type: "SET_CODE_LIST_LABEL"; payload: string }
  | { type: "SET_CODES"; payload: CodeTableRow[] }
  | { type: "ADD_CODE"; payload: CodeTableRow }
  | {
      type: "UPDATE_CODE";
      payload: { id: string; field: "value" | "label"; value: string };
    }
  | { type: "DELETE_CODE"; payload: string }
  | { type: "SHOW_DATA_TABLE" }
  | { type: "SHOW_REUSE_SELECT" }
  | { type: "TOGGLE_REUSE_SELECT" }
  | { type: "SET_SELECTED_CODE_LIST_ID"; payload: string | null }
  | { type: "RESET_EMPTY_ROW" }
  | {
      type: "INIT_FROM_CODE_LIST";
      payload: { label: string; codes: CodeTableRow[]; showDataTable: boolean };
    }
  | { type: "INIT_REUSED_CODE_LIST"; payload: { selectedCodeListId: string } };

export const initialState: CodeRepresentationState = {
  codeListLabel: "",
  codes: [],
  showDataTable: false,
  showReuseSelect: false,
  selectedCodeListId: null,
};

export const codeRepresentationReducer = (
  state: CodeRepresentationState,
  action: CodeRepresentationAction,
): CodeRepresentationState => {
  switch (action.type) {
    case "SET_CODE_LIST_LABEL":
      return { ...state, codeListLabel: action.payload };

    case "SET_CODES":
      return { ...state, codes: action.payload };

    case "ADD_CODE":
      return { ...state, codes: [...state.codes, action.payload] };

    case "UPDATE_CODE":
      return {
        ...state,
        codes: state.codes.map((code) =>
          code.id === action.payload.id
            ? { ...code, [action.payload.field]: action.payload.value }
            : code,
        ),
      };

    case "DELETE_CODE":
      return {
        ...state,
        codes: state.codes.filter((code) => code.id !== action.payload),
      };

    case "SHOW_DATA_TABLE":
      return { ...state, showDataTable: true, showReuseSelect: false };

    case "SHOW_REUSE_SELECT":
      return { ...state, showReuseSelect: true, showDataTable: false };

    case "TOGGLE_REUSE_SELECT":
      return {
        ...state,
        showReuseSelect: !state.showReuseSelect,
        showDataTable: false,
      };

    case "SET_SELECTED_CODE_LIST_ID":
      return { ...state, selectedCodeListId: action.payload };

    case "INIT_FROM_CODE_LIST":
      return {
        ...state,
        codeListLabel: action.payload.label,
        codes: action.payload.codes,
        showDataTable: action.payload.showDataTable,
      };

    case "INIT_REUSED_CODE_LIST":
      return {
        ...state,
        selectedCodeListId: action.payload.selectedCodeListId,
        showReuseSelect: true,
        showDataTable: false,
      };

    default:
      return state;
  }
};
