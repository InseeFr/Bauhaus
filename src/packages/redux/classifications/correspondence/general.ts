import { LOADED } from "@sdk/constants";

import * as generalUtils from "../../../modules-classifications/utils/correspondence/general";
import { LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS } from "../../actions/constants";
import { ReduxAction } from "../../model";

const reducers = (state: any = {}, action: ReduxAction) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS: {
      const { id, results } = payload;
      return {
        ...state,
        [id]: {
          status: LOADED,
          //ensure that all the fields are present (the server
          //does not return the fields not defined)
          results: { ...generalUtils.empty(), ...results },
        },
      };
    }
    default:
      return state;
  }
};

export default reducers;
export function getGeneral(state: any, id: string) {
  return state[id] && state[id].results;
}
