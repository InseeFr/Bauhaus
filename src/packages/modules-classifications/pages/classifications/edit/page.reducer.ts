import { Classification, ClassificationWithLevels } from "../../../types";
import { validate } from "./validation";

export type ClientSideErrors = {
  errorMessage?: string[];
  fields?: Partial<Record<keyof Classification, string>>;
};

export type State = {
  clientSideErrors: ClientSideErrors;
  submitting: boolean;
  /** Un enregistrement a été refusé par la validation : chaque saisie revalide le formulaire. */
  saveAttempted: boolean;
  value: ClassificationWithLevels | undefined;
};

export type Action =
  | { type: "SET_VALUE"; payload: ClassificationWithLevels }
  | { type: "SET_GENERAL"; payload: Partial<Classification> }
  | { type: "SET_ERRORS"; payload: ClientSideErrors }
  | { type: "SAVE_REJECTED_BY_VALIDATION"; payload: ClientSideErrors }
  | { type: "CLEAR_ERROR_MESSAGE" }
  | { type: "SET_SUBMITTING" };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, value: action.payload };
    case "SET_GENERAL": {
      if (!state.value) return state;
      const general = { ...state.value.general, ...action.payload };
      return {
        ...state,
        clientSideErrors: state.saveAttempted ? validate(general) : state.clientSideErrors,
        value: { ...state.value, general },
      };
    }
    case "SET_ERRORS":
      return { ...state, clientSideErrors: action.payload };
    case "SAVE_REJECTED_BY_VALIDATION":
      return { ...state, submitting: true, saveAttempted: true, clientSideErrors: action.payload };
    case "CLEAR_ERROR_MESSAGE":
      if (state.saveAttempted) return state;
      return {
        ...state,
        clientSideErrors: { ...state.clientSideErrors, errorMessage: [] },
      };
    case "SET_SUBMITTING":
      return { ...state, submitting: true };
    default:
      return state;
  }
}

export const initialState: State = {
  clientSideErrors: {},
  submitting: false,
  saveAttempted: false,
  value: undefined,
};
