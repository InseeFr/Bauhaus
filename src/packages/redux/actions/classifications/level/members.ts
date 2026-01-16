import { Dispatch } from "redux";

import { ClassificationsApi } from "@sdk/classification";

import * as A from "../../../actions/constants";

const fetchClassificationLevelMembers =
  (classificationId: string, levelId: string) => (dispatch: Dispatch) => {
    dispatch({
      type: A.LOAD_CLASSIFICATION_LEVEL_MEMBERS,
      payload: {
        classificationId,
        levelId,
      },
    });
    return ClassificationsApi.getClassificationLevelMembers(classificationId, levelId).then(
      (results: any) => {
        dispatch({
          type: A.LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS,
          payload: { classificationId, levelId, results },
        });
        return results;
      },
      (err: unknown) =>
        dispatch({
          type: A.LOAD_CLASSIFICATION_LEVEL_MEMBERS_FAILURE,
          payload: { err, classificationId, levelId },
        }),
    );
  };
export default fetchClassificationLevelMembers;
