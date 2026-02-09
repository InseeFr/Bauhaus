export const ACTION_TYPES = {
  SET_SEARCH_VALUE: "SET_SEARCH_VALUE",
  SET_TYPE_FILTER: "SET_TYPE_FILTER",
  SET_EDIT_MODAL_VISIBLE: "SET_EDIT_MODAL_VISIBLE",
  SET_IMPORT_MODAL_VISIBLE: "SET_IMPORT_MODAL_VISIBLE",
  SET_FORM_DATA: "SET_FORM_DATA",
  SET_IMPORT_DATA: "SET_IMPORT_DATA",
  SET_SELECTED_VARIABLE: "SET_SELECTED_VARIABLE",
  UPDATE_VARIABLE: "UPDATE_VARIABLE",
  ADD_VARIABLE: "ADD_VARIABLE",
  DELETE_VARIABLE: "DELETE_VARIABLE",
  CLEAR_LOCAL_VARIABLES: "CLEAR_LOCAL_VARIABLES",
} as const;

import type {
  NumericRepresentation,
  DateTimeRepresentation,
  TextRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
} from "../../types/api";

// Type réutilisable pour les variables
export interface VariableData {
  id: string;
  label: string;
  name: string;
  description?: string;
  type: string;
  isGeographic?: boolean;
  textRepresentation?: TextRepresentation;
  numericRepresentation?: NumericRepresentation;
  dateRepresentation?: DateTimeRepresentation;
  codeRepresentation?: CodeRepresentation;
  codeList?: CodeList;
  categories?: Category[];
}

export interface State {
  searchValue: string;
  typeFilter: string;
  isEditModalVisible: boolean;
  isImportModalVisible: boolean;
  formData: { label: string };
  importData: string;
  selectedVariable: VariableData | null;
  localVariables: VariableData[];
  deletedVariableIds: string[];
}

export type Action =
  | { type: typeof ACTION_TYPES.SET_SEARCH_VALUE; payload: string }
  | { type: typeof ACTION_TYPES.SET_TYPE_FILTER; payload: string }
  | { type: typeof ACTION_TYPES.SET_EDIT_MODAL_VISIBLE; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_IMPORT_MODAL_VISIBLE; payload: boolean }
  | {
      type: typeof ACTION_TYPES.SET_FORM_DATA;
      payload: { label: string };
    }
  | { type: typeof ACTION_TYPES.SET_IMPORT_DATA; payload: string }
  | {
      type: typeof ACTION_TYPES.SET_SELECTED_VARIABLE;
      payload: VariableData | null;
    }
  | {
      type: typeof ACTION_TYPES.UPDATE_VARIABLE;
      payload: VariableData;
    }
  | {
      type: typeof ACTION_TYPES.ADD_VARIABLE;
      payload: VariableData;
    }
  | {
      type: typeof ACTION_TYPES.DELETE_VARIABLE;
      payload: string;
    }
  | { type: typeof ACTION_TYPES.CLEAR_LOCAL_VARIABLES };

export const initialState: State = {
  searchValue: "",
  typeFilter: "all",
  isEditModalVisible: false,
  isImportModalVisible: false,
  formData: { label: "" },
  importData: "",
  selectedVariable: null,
  localVariables: [],
  deletedVariableIds: [],
};

export function viewReducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTION_TYPES.SET_SEARCH_VALUE:
      return { ...state, searchValue: action.payload };
    case ACTION_TYPES.SET_TYPE_FILTER:
      return { ...state, typeFilter: action.payload };
    case ACTION_TYPES.SET_EDIT_MODAL_VISIBLE:
      return { ...state, isEditModalVisible: action.payload };
    case ACTION_TYPES.SET_IMPORT_MODAL_VISIBLE:
      return { ...state, isImportModalVisible: action.payload };
    case ACTION_TYPES.SET_FORM_DATA:
      return { ...state, formData: action.payload };
    case ACTION_TYPES.SET_IMPORT_DATA:
      return { ...state, importData: action.payload };
    case ACTION_TYPES.SET_SELECTED_VARIABLE:
      return { ...state, selectedVariable: action.payload };
    case ACTION_TYPES.UPDATE_VARIABLE: {
      // Vérifier si la variable existe déjà dans localVariables
      const existsInLocal = state.localVariables.some(
        (variable) => variable.id === action.payload.id,
      );

      let updatedVariables;
      if (existsInLocal) {
        // Mettre à jour la variable existante
        updatedVariables = state.localVariables.map((variable) =>
          variable.id === action.payload.id ? action.payload : variable,
        );
      } else {
        // Ajouter la variable si elle n'existe pas encore
        updatedVariables = [...state.localVariables, action.payload];
      }

      return {
        ...state,
        localVariables: updatedVariables,
      };
    }
    case ACTION_TYPES.ADD_VARIABLE:
      return {
        ...state,
        localVariables: [...state.localVariables, action.payload],
      };
    case ACTION_TYPES.DELETE_VARIABLE:
      return {
        ...state,
        localVariables: state.localVariables.filter((variable) => variable.id !== action.payload),
        deletedVariableIds: [...state.deletedVariableIds, action.payload],
      };
    case ACTION_TYPES.CLEAR_LOCAL_VARIABLES:
      return {
        ...state,
        localVariables: [],
        deletedVariableIds: [],
      };
    default:
      return state;
  }
}

// Action creators
export const actions = {
  setSearchValue: (payload: string): Action => ({
    type: ACTION_TYPES.SET_SEARCH_VALUE,
    payload,
  }),
  setTypeFilter: (payload: string): Action => ({
    type: ACTION_TYPES.SET_TYPE_FILTER,
    payload,
  }),
  setEditModalVisible: (payload: boolean): Action => ({
    type: ACTION_TYPES.SET_EDIT_MODAL_VISIBLE,
    payload,
  }),
  setImportModalVisible: (payload: boolean): Action => ({
    type: ACTION_TYPES.SET_IMPORT_MODAL_VISIBLE,
    payload,
  }),
  setFormData: (payload: { label: string }): Action => ({
    type: ACTION_TYPES.SET_FORM_DATA,
    payload,
  }),
  setImportData: (payload: string): Action => ({
    type: ACTION_TYPES.SET_IMPORT_DATA,
    payload,
  }),
  setSelectedVariable: (payload: VariableData | null): Action => ({
    type: ACTION_TYPES.SET_SELECTED_VARIABLE,
    payload,
  }),
  updateVariable: (payload: VariableData): Action => ({
    type: ACTION_TYPES.UPDATE_VARIABLE,
    payload,
  }),
  addVariable: (payload: VariableData): Action => ({
    type: ACTION_TYPES.ADD_VARIABLE,
    payload,
  }),
  deleteVariable: (payload: string): Action => ({
    type: ACTION_TYPES.DELETE_VARIABLE,
    payload,
  }),
  clearLocalVariables: (): Action => ({
    type: ACTION_TYPES.CLEAR_LOCAL_VARIABLES,
  }),
};
