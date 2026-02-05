import { Distribution } from "../../../../model/Dataset";

export type DistributionEditState = {
  editingDistribution: Partial<Distribution>;
  clientSideErrors: {
    errorMessage?: string[];
    fields?: Record<string, string>;
  };
  submitting: boolean;
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
      type: "CLEAR_ERROR_MESSAGES";
    }
  | {
      type: "SET_SUBMITTING";
      payload: boolean;
    };

export const initialState: DistributionEditState = {
  editingDistribution: {},
  clientSideErrors: {},
  submitting: false,
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
    case "UPDATE_DISTRIBUTION":
      return {
        ...state,
        editingDistribution: {
          ...state.editingDistribution,
          ...action.payload,
        },
      };
    case "SET_CLIENT_SIDE_ERRORS":
      return {
        ...state,
        clientSideErrors: action.payload,
      };
    case "CLEAR_ERROR_MESSAGES":
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
