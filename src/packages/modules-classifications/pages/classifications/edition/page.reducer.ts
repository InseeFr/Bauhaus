import { Classification, ClassificationWithLevels } from "../../../types";

export type ClientSideErrors = {
  errorMessage?: string[];
  fields?: Partial<Record<keyof Classification, string>>;
};

export type State = {
  clientSideErrors: ClientSideErrors;
  submitting: boolean;
  value: ClassificationWithLevels | undefined;
};

export type Action =
  | { type: "SET_VALUE"; payload: ClassificationWithLevels }
  | { type: "SET_GENERAL"; payload: Partial<Classification> }
  | { type: "SET_ERRORS"; payload: ClientSideErrors }
  | { type: "CLEAR_ERROR_MESSAGE" }
  | { type: "SET_SUBMITTING" };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, value: action.payload };
    case "SET_GENERAL":
      if (!state.value) return state;
      return {
        ...state,
        value: {
          ...state.value,
          general: { ...state.value.general, ...action.payload },
        },
      };
    case "SET_ERRORS":
      return { ...state, clientSideErrors: action.payload };
    case "CLEAR_ERROR_MESSAGE":
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
  value: undefined,
};
