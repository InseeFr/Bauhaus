import {
  LOAD_OPERATIONS_SIMS_SUCCESS,
  PUBLISH_OPERATIONS_SIMS_SUCCESS,
  SAVE_OPERATIONS_SIMS,
  SAVE_OPERATIONS_SIMS_SUCCESS,
} from "../actions/constants";
import { ReduxAction } from "../model";

/**
 * Reducer for fetching the current indicator displayed during the visualisation or the edition
 */
export const operationsSimsCurrent = function (state = {}, action: ReduxAction) {
  switch (action.type) {
    case LOAD_OPERATIONS_SIMS_SUCCESS:
    case SAVE_OPERATIONS_SIMS:
      return action.payload;
    case SAVE_OPERATIONS_SIMS_SUCCESS:
    case PUBLISH_OPERATIONS_SIMS_SUCCESS:
      //When we save an item, we reset the current item stored in the store in order to send a new GET HTTP request
      return {};
    default:
      return state;
  }
};

export * from "./loadStatus";
