import { LOADED, LOADING } from "@sdk/constants";

import * as associationUtils from "../../../modules-classifications/utils/correspondence/association";
import {
  LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION,
  LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS,
} from "../../actions/constants";
import { CorrespondenceReduxModel, ReduxAction } from "../../model";

const reducers = (state: CorrespondenceReduxModel = {}, action: ReduxAction) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION: {
      const { correspondenceId, associationId } = payload;
      const otherAssociation = state[correspondenceId];
      return {
        ...state,
        [correspondenceId]: {
          ...otherAssociation,
          [associationId]: {
            status: LOADING,
          },
        },
      };
    }
    case LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS: {
      const { correspondenceId, associationId, results } = payload;
      const otherAssociation = state[correspondenceId];
      return {
        ...state,
        [correspondenceId]: {
          ...otherAssociation,
          [associationId]: {
            status: LOADED,
            results: {
              ...associationUtils.empty(),
              ...results,
            },
          },
        },
      };
    }
    default:
      return state;
  }
};

export default reducers;
export const getAssociation = (state: any, correspondenceId: string, associationId: string) =>
  state.classificationsCorrespondenceAssociation[correspondenceId]?.[associationId]?.results;
