import { Distribution } from "@model/Dataset";

import { validate } from "./validation";

export type DistributionEditState = {
  editingDistribution: Partial<Distribution>;
  clientSideErrors: {
    errorMessage?: string[];
    fields?: Record<string, string>;
  };
  submitting: boolean;
  /** Un enregistrement a été refusé par la validation : chaque saisie revalide la distribution. */
  saveAttempted: boolean;
};

export type DistributionEditAction =
  | {
      type: "SET_DISTRIBUTION";
      payload: Record<string, unknown>;
    }
  | {
      type: "UPDATE_DISTRIBUTION";
      payload: Partial<Record<string, unknown>>;
    }
  | {
      type: "SET_CLIENT_SIDE_ERRORS";
      payload: {
        errorMessage?: string[];
        fields?: Record<string, string>;
      };
    }
  | {
      type: "SAVE_REJECTED_BY_VALIDATION";
      payload: {
        errorMessage?: string[];
        fields?: Record<string, string>;
      };
    }
  | {
      type: "CLEAR_ERROR_MESSAGES";
    }
  | {
      type: "SET_SUBMITTING";
      payload: boolean;
    };

export const initialState: DistributionEditState = {
  editingDistribution: {
    labelLg1: "",
    labelLg2: "",
    descriptionLg1: "",
    descriptionLg2: "",
    accessUrl: "",
    url: "",
  },
  clientSideErrors: {},
  submitting: false,
  saveAttempted: false,
};

export const reducer = (
  state: DistributionEditState,
  action: DistributionEditAction,
): DistributionEditState => {
  switch (action.type) {
    case "SET_DISTRIBUTION":
      return {
        ...state,
        editingDistribution: action.payload,
      };
    case "UPDATE_DISTRIBUTION": {
      const editingDistribution = {
        ...state.editingDistribution,
        ...action.payload,
      };
      return {
        ...state,
        editingDistribution,
        clientSideErrors: state.saveAttempted
          ? validate(editingDistribution)
          : state.clientSideErrors,
      };
    }
    case "SET_CLIENT_SIDE_ERRORS":
      return {
        ...state,
        clientSideErrors: action.payload,
      };
    case "SAVE_REJECTED_BY_VALIDATION":
      return {
        ...state,
        submitting: true,
        saveAttempted: true,
        clientSideErrors: action.payload,
      };
    case "CLEAR_ERROR_MESSAGES":
      if (state.saveAttempted) return state;
      return {
        ...state,
        clientSideErrors: {
          ...state.clientSideErrors,
          errorMessage: [],
        },
      };
    case "SET_SUBMITTING":
      return {
        ...state,
        submitting: action.payload,
      };
    default:
      return state;
  }
};
