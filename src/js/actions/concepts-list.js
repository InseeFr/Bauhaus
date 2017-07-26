import { getConceptsList, postConceptsToExport } from 'js/utils/remote-api';

export const LOAD_CONCEPTS_LIST = 'LOAD_CONCEPTS_LIST';
export const LOAD_CONCEPTS_LIST_SUCCESS = 'LOAD_CONCEPTS_LIST_SUCCESS';
export const LOAD_CONCEPTS_LIST_FAILURE = 'LOAD_CONCEPTS_LIST_FAILURE';

export const EXPORT_CONCEPTS = 'EXPORT_CONCEPTS';
export const EXPORT_CONCEPTS_SUCCESS = 'EXPORT_CONCEPTS_SUCCESS';
export const EXPORT_CONCEPTS_FAILURE = 'EXPORT_CONCEPT_FAILURE';

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

export const exportConcepts = concepts => dispatch => {
  dispatch({
    type: EXPORT_CONCEPTS,
    payload: { concepts },
  });
  postConceptsToExport(concepts).then(() => {
    dispatch(
      {
        type: EXPORT_CONCEPTS_SUCCESS,
        payload: {
          concepts,
        },
      },
      err =>
        dispatch({
          type: EXPORT_CONCEPTS_FAILURE,
          payload: {
            err,
            concepts,
          },
        })
    );
  });
};
