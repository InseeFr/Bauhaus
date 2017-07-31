import api from 'js/remote-api/api';

export const LOAD_CONCEPTS_SEARCH_LIST = 'LOAD_CONCEPTS_SEARCH_LIST';
export const LOAD_CONCEPTS_SEARCH_LIST_SUCCESS =
  'LOAD_CONCEPTS_SEARCH_LIST_SUCCESS';
export const LOAD_CONCEPTS_SEARCH_LIST_FAILURE =
  'LOAD_CONCEPTS_SEARCH_LIST_FAILURE';

export const loadConceptsSearchList = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_CONCEPTS_SEARCH_LIST,
    payload: null,
  });
  return api
    .getConceptSearchList()
    .then(
      conceptsSearchList =>
        dispatch(loadConceptsSearchListSuccess(conceptsSearchList)),
      err => dispatch(loadConceptsSearchListFailure(err.toString()))
    );
};

export function loadConceptsSearchListSuccess(conceptsSearchList) {
  return {
    type: LOAD_CONCEPTS_SEARCH_LIST_SUCCESS,
    payload: {
      results: conceptsSearchList,
    },
  };
}

export function loadConceptsSearchListFailure(err) {
  return {
    type: LOAD_CONCEPTS_SEARCH_LIST_FAILURE,
    payload: err,
  };
}
