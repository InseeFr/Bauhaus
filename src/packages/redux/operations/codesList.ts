import { ERROR, LOADED, LOADING } from "@sdk/constants";

import {
  LOAD_OPERATIONS_CODES_LIST,
  LOAD_OPERATIONS_CODES_LIST_FAILURE,
  LOAD_OPERATIONS_CODES_LIST_SUCCESS,
} from "../actions/constants";
import { CL_FREQ, CL_SOURCE_CATEGORY } from "../actions/constants/codeList";
import { ReduxAction } from "../model";

const defaultState = {
  results: {
    [CL_SOURCE_CATEGORY]: { codes: [] },
    [CL_FREQ]: { codes: [] },
  },
};
const operationsCodesList = function (state = defaultState, action: ReduxAction) {
  switch (action.type) {
    case LOAD_OPERATIONS_CODES_LIST:
      return {
        ...defaultState,
        status: LOADING,
      };
    case LOAD_OPERATIONS_CODES_LIST_SUCCESS:
      return {
        status: LOADED,
        results: {
          ...state.results,
          [action.payload.notation]: action.payload,
        },
      };
    case LOAD_OPERATIONS_CODES_LIST_FAILURE:
      return {
        status: ERROR,
        err: action.payload.err,
      };
    default:
      return state;
  }
};

const codesList = {
  operationsCodesList,
};

export default codesList;
