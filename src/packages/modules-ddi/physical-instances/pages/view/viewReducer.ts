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
  ADD_EDITED_VARIABLE: "ADD_EDITED_VARIABLE",
  DELETE_VARIABLE: "DELETE_VARIABLE",
  CLEAR_LOCAL_VARIABLES: "CLEAR_LOCAL_VARIABLES",
  REUSE_VARIABLE: "REUSE_VARIABLE",
} as const;

import type {
  NumericRepresentation,
  DateTimeRepresentation,
  TextRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
  ManagedMissingValuesRepresentation,
  Reference,
  Variable,
} from "../../types/api";

// Type réutilisable pour les variables
export interface VariableData {
  id: string;
  label: string;
  name: string;
  /** VersionDate stockée ; absente pour une variable créée localement et pas encore enregistrée. */
  versionDate?: string;
  description?: string;
  type: string;
  isGeographic?: boolean;
  textRepresentation?: TextRepresentation;
  numericRepresentation?: NumericRepresentation;
  dateRepresentation?: DateTimeRepresentation;
  codeRepresentation?: CodeRepresentation;
  codeList?: CodeList;
  categories?: Category[];
  // Valeurs sentinelles (#1566) : référence vers la MMVR du groupe posée sur la variable, et —
  // quand la variable est seule utilisatrice et l'a modifiée — la MMVR matérialisée, sa CodeList
  // de sentinelles et ses catégories à embarquer au save (mêmes IDs, modification en place).
  missingValuesReference?: Reference;
  sentinelMmvr?: ManagedMissingValuesRepresentation;
  sentinelCodeList?: CodeList;
  sentinelCategories?: Category[];
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
  /**
   * Pour une variable ajoutée localement, l'ID de la variable après laquelle elle doit
   * apparaître dans le tableau (duplication : juste après sa source). Sans entrée, la
   * variable est ajoutée en fin de liste.
   */
  newVariableAnchors: Record<string, string>;
  /**
   * Variables réutilisées depuis le VariableScheme de l'étude (#1387), pas encore enregistrées :
   * les items tels que stockés. Envoyés inchangés à la sauvegarde tant qu'ils ne sont pas modifiés
   * — reconstruits depuis le formulaire, ils perdraient les champs qu'il ne gère pas (autres
   * langues…), et ces pertes toucheraient tous les fichiers qui partagent la variable.
   */
  reusedVariables: Variable[];
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
      afterId?: string;
    }
  | {
      type: typeof ACTION_TYPES.ADD_EDITED_VARIABLE;
      payload: VariableData;
    }
  | {
      type: typeof ACTION_TYPES.DELETE_VARIABLE;
      payload: string;
    }
  | { type: typeof ACTION_TYPES.CLEAR_LOCAL_VARIABLES }
  | {
      type: typeof ACTION_TYPES.REUSE_VARIABLE;
      payload: Variable;
    };

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
  newVariableAnchors: {},
  reusedVariables: [],
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
      // Une saisie reportée à la fermeture du panneau peut arriver après la suppression de la
      // variable : elle ne doit pas la faire réapparaître.
      if (state.deletedVariableIds.includes(action.payload.id)) {
        return state;
      }

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
        // Le panneau reste ouvert sur la variable reportée (#1608) : elle devient sa référence.
        selectedVariable:
          state.selectedVariable?.id === action.payload.id
            ? action.payload
            : state.selectedVariable,
      };
    }
    case ACTION_TYPES.ADD_VARIABLE:
      return {
        ...state,
        localVariables: [...state.localVariables, action.payload],
        newVariableAnchors: action.afterId
          ? { ...state.newVariableAnchors, [action.payload.id]: action.afterId }
          : state.newVariableAnchors,
      };
    case ACTION_TYPES.ADD_EDITED_VARIABLE:
      // Variable en création reportée dans le tableau (#1608) : le panneau, ouvert sur « new »,
      // bascule sur la variable ajoutée pour que les saisies suivantes mettent à jour sa ligne.
      return {
        ...state,
        localVariables: [...state.localVariables, action.payload],
        selectedVariable:
          state.selectedVariable?.id === "new" ? action.payload : state.selectedVariable,
      };
    case ACTION_TYPES.DELETE_VARIABLE: {
      const { [action.payload]: _removed, ...remainingAnchors } = state.newVariableAnchors;
      return {
        ...state,
        localVariables: state.localVariables.filter((variable) => variable.id !== action.payload),
        deletedVariableIds: [...state.deletedVariableIds, action.payload],
        newVariableAnchors: remainingAnchors,
        reusedVariables: state.reusedVariables.filter((variable) => variable.ID !== action.payload),
      };
    }
    case ACTION_TYPES.CLEAR_LOCAL_VARIABLES:
      return {
        ...state,
        localVariables: [],
        deletedVariableIds: [],
        newVariableAnchors: {},
        reusedVariables: [],
      };
    case ACTION_TYPES.REUSE_VARIABLE:
      return {
        ...state,
        reusedVariables: [...state.reusedVariables, action.payload],
        // Une variable retirée puis réutilisée à nouveau avant la sauvegarde redevient présente.
        deletedVariableIds: state.deletedVariableIds.filter((id) => id !== action.payload.ID),
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
  addVariable: (payload: VariableData, afterId?: string): Action => ({
    type: ACTION_TYPES.ADD_VARIABLE,
    payload,
    afterId,
  }),
  addEditedVariable: (payload: VariableData): Action => ({
    type: ACTION_TYPES.ADD_EDITED_VARIABLE,
    payload,
  }),
  deleteVariable: (payload: string): Action => ({
    type: ACTION_TYPES.DELETE_VARIABLE,
    payload,
  }),
  clearLocalVariables: (): Action => ({
    type: ACTION_TYPES.CLEAR_LOCAL_VARIABLES,
  }),
  reuseVariable: (payload: Variable): Action => ({
    type: ACTION_TYPES.REUSE_VARIABLE,
    payload,
  }),
};
