export type DdiFormat = "DDI3" | "DDI4";

interface DdiPreviewState {
  format: DdiFormat;
  ddiXml: string | null;
  isLoading: boolean;
}

type DdiPreviewAction =
  | { type: "SET_FORMAT"; payload: DdiFormat }
  | { type: "LOADING" }
  | { type: "LOAD_SUCCESS"; payload: string }
  | { type: "LOAD_ERROR" };

export const initialState: DdiPreviewState = {
  format: "DDI3",
  ddiXml: null,
  isLoading: true,
};

export const ddiPreviewReducer = (
  state: DdiPreviewState,
  action: DdiPreviewAction,
): DdiPreviewState => {
  switch (action.type) {
    case "SET_FORMAT":
      return { ...state, format: action.payload };
    case "LOADING":
      return { ...state, isLoading: true };
    case "LOAD_SUCCESS":
      return { ...state, isLoading: false, ddiXml: action.payload };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, ddiXml: null };
  }
};
