import { getDisseminationStatusList } from '../utils/remote-api';

export const LOAD_DISSEMINATION_STATUS_LIST = 'LOAD_DISSEMINATION_STATUS_LIST';
export const LOAD_DISSEMINATION_STATUS_LIST_SUCCESS =
  'LOAD_DISSEMINATION_STATUS_LIST_SUCCESS';
export const LOAD_DISSEMINATION_STATUS_LIST_FAILURE =
  'LOAD_DISSEMINATION_STATUS_LIST_FAILURE';

export const loadDisseminationStatusList = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_DISSEMINATION_STATUS_LIST,
    payload: null
  });
  return getDisseminationStatusList()
    .then(disseminationStatusList =>
      dispatch(
        loadDisseminationStatusListSuccess(
          disseminationStatusList.disseminationStatus
        )
      )
    )
    .catch(err => dispatch(loadDisseminationStatusListFailure(err.toString())));
};

export function loadDisseminationStatusListSuccess(disseminationStatusList) {
  return {
    type: LOAD_DISSEMINATION_STATUS_LIST_SUCCESS,
    payload: {
      results: disseminationStatusList
    }
  };
}

export function loadDisseminationStatusListFailure(err) {
  return {
    type: LOAD_DISSEMINATION_STATUS_LIST_FAILURE,
    payload: err
  };
}
