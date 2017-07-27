import { getStamps } from 'js/utils/igesa-api';

export const LOAD_STAMPS_LIST = 'LOAD_STAMPS_LIST';
export const LOAD_STAMPS_LIST_SUCCESS = 'LOAD_STAMPS_LIST_SUCCESS';
export const LOAD_STAMPS_LIST_FAILURE = 'LOAD_STAMPS_LIST_FAILURE';

export const loadStampsList = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_STAMPS_LIST,
    payload: null,
  });
  return getStamps().then(
    stampsList => dispatch(loadStampsListSuccess(stampsList)),
    err => dispatch(loadStampsListFailure(err.toString()))
  );
};

export function loadStampsListSuccess(stampsList) {
  return {
    type: LOAD_STAMPS_LIST_SUCCESS,
    payload: {
      results: stampsList,
    },
  };
}

export function loadStampsListFailure(err) {
  return {
    type: LOAD_STAMPS_LIST_FAILURE,
    payload: err,
  };
}
