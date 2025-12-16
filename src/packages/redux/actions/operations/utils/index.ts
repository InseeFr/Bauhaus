import { Dispatch } from "redux";

import { ReduxModel } from "../../../model";

/**
 * This is a factory we use to create actions related to the publish action.
 * The callback paramter is used only if we need to display server-side error
 *
 * @param {*} remoteCall The method we must call in order to publish the object
 * @param {*} LOADING The name of the action when loading
 * @param {*} SUCCESS The name of the action if this is a success
 * @param {*} FAILURE The name of the action if this is an error
 */
export const getPublishFactory = (
  remoteCall: (value: unknown) => Promise<unknown>,
  LOADING: string,
  SUCCESS: string,
  FAILURE: string,
) => {
  return (object: unknown, callback: (err: null | string, value?: unknown) => void = () => {}) =>
    (dispatch: Dispatch) => {
      dispatch({
        type: LOADING,
        payload: {},
      });

      return remoteCall(object).then(
        (results) => {
          dispatch({
            type: SUCCESS,
            payload: results,
          });
          callback(null, results);
        },
        (err: string) => {
          dispatch({
            type: FAILURE,
            payload: { err },
          });
          callback(err);
        },
      );
    };
};

export const getItemFactory =
  (
    remoteCall: (id: string) => Promise<unknown>,
    LOADING: string,
    SUCCESS: string,
    FAILURE: string,
  ) =>
  (id: string) =>
  (dispatch: Dispatch, getState: () => ReduxModel) => {
    if (getState().operationsOperationCurrentStatus === LOADING) {
      return;
    }
    dispatch({
      type: LOADING,
      payload: {
        id,
      },
    });
    return remoteCall(id).then(
      (results) =>
        dispatch({
          type: SUCCESS,
          payload: results,
        }),
      (err: string) =>
        dispatch({
          type: FAILURE,
          payload: { err },
        }),
    );
  };
