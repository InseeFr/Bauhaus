import { CollectionDashboardItem } from "@model/concepts/collection";

import { ConceptForAdvancedSearch } from "../../../types/concept";

type State = {
  loading: boolean;
  error: unknown;
  concepts: ConceptForAdvancedSearch[];
  collections: CollectionDashboardItem[];
};

type Action =
  | {
      type: "FETCH_SUCCESS";
      concepts: ConceptForAdvancedSearch[];
      collections: CollectionDashboardItem[];
    }
  | { type: "FETCH_ERROR"; error: unknown }
  | { type: "FETCH_COMPLETE" };

export const initialState: State = {
  loading: true,
  error: null,
  concepts: [],
  collections: [],
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, concepts: action.concepts, collections: action.collections };
    case "FETCH_ERROR":
      return { ...state, error: action.error };
    case "FETCH_COMPLETE":
      return { ...state, loading: false };
  }
};
