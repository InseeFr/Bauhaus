import { LOADED, LOADING, ERROR } from "@sdk/constants";

import { sortArrayByLabel } from "../../utils/array-utils";
import { ReduxAction } from "../model";
import * as currentReducers from "./current";
import {
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
} from "./metadatastructure/list";

/**
 *
 * @param {Array<String>} param List of Redux event
 */
function makeReducers([GET_ITEMS, GET_ITEMS_SUCCESS, GET_ITEMS_FAILURE, SAVE_ITEM_SUCCESS]: any[]) {
  return function (state: any = {}, action: ReduxAction) {
    switch (action.type) {
      case GET_ITEMS:
        return {
          status: LOADING,
        };
      case GET_ITEMS_SUCCESS:
        return {
          status: LOADED,
          results: action.payload.results,
        };
      case GET_ITEMS_FAILURE:
        return {
          status: ERROR,
          err: action.payload.err,
        };
      case SAVE_ITEM_SUCCESS: {
        if (!state.results) return state;

        /**
         * When we add / update a new object, we must first remove this updated item from
         * the previous list.
         *
         * Finally, we should sort by label again
         */
        const tail = state.results.filter((obj: any) => obj.id !== action.payload.id);
        return {
          status: state.status,
          results: sortArrayByLabel([
            ...tail,
            {
              id: action.payload.id,
              label: action.payload.prefLabelLg1,
              altLabel: action.payload.altLabelLg1 || action.payload.altLabel,
            },
          ]),
        };
      }
      default:
        return state;
    }
  };
}

const operationsMetadataStructureList = makeReducers([
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
  LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
]);

const operations = {
  operationsMetadataStructureList,
  ...currentReducers,
};

export default operations;
