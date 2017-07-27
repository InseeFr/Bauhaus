import { getConceptsList } from 'js/utils/remote-api';

export const LOAD_CONCEPTS_LIST = 'LOAD_CONCEPTS_LIST';
export const LOAD_CONCEPTS_LIST_SUCCESS = 'LOAD_CONCEPTS_LIST_SUCCESS';
export const LOAD_CONCEPTS_LIST_FAILURE = 'LOAD_CONCEPTS_LIST_FAILURE';
export const loadConceptsList = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_CONCEPTS_LIST,
    payload: null,
  });
  return getConceptsList().then(
    conceptsList => dispatch(loadConceptsListSuccess(conceptsList)),
    err => dispatch(loadConceptsListFailure({ err: err.toString() }))
  );
};

export function loadConceptsListSuccess(conceptsList) {
  return {
    type: LOAD_CONCEPTS_LIST_SUCCESS,
    payload: {
      results: conceptsList,
    },
  };
}

export function loadConceptsListFailure(err) {
  return {
    type: LOAD_CONCEPTS_LIST_FAILURE,
    payload: err,
  };
}
