import { Dispatch } from "redux";

import { ClassificationsApi } from "@sdk/classification";

import * as A from "../../actions/constants";

const loadClassificationLevels = (id: string) => (dispatch: Dispatch) => {
  dispatch({
    type: A.LOAD_CLASSIFICATION_LEVELS,
    payload: {
      id,
    },
  });
  return ClassificationsApi.getClassificationLevels(id).then(
    (results: any) => {
      dispatch({
        type: A.LOAD_CLASSIFICATION_LEVELS_SUCCESS,
        payload: { id, results },
      });
      return results;
    },
    (err: any) =>
      dispatch({
        type: A.LOAD_CLASSIFICATION_LEVELS_FAILURE,
        payload: { err, id },
      }),
  );
};

export default loadClassificationLevels;
