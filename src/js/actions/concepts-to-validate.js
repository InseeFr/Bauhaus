import {
  getConceptsToValidate,
  postConceptsToValidate,
} from 'js/utils/remote-api';

import { PENDING, OK } from 'js/constants';

export const LOAD_CONCEPTS_TO_VALIDATE = 'LOAD_CONCEPTS_TO_VALIDATE';
export const LOAD_CONCEPTS_TO_VALIDATE_SUCCESS =
  'LOAD_CONCEPTS_TO_VALIDATE_SUCCESS';
export const LOAD_CONCEPTS_TO_VALIDATE_FAILURE =
  'LOAD_CONCEPTS_TO_VALIDATE_FAILURE';
export const VALIDATE_CONCEPTS = 'VALIDATE_CONCEPTS';
export const VALIDATE_CONCEPTS_SUCCESS = 'VALIDATE_CONCEPTS_SUCCESS';
export const VALIDATE_CONCEPTS_FAILURE = 'VALIDATE_CONCEPTS_FAILURE';

export const loadConceptsToValidate = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_CONCEPTS_TO_VALIDATE,
    payload: null,
  });
  return getConceptsToValidate().then(
    conceptsToValidate =>
      dispatch(loadConceptsToValidateSuccess(conceptsToValidate)),
    err => dispatch(loadConceptsToValidateFailure(err.toString()))
  );
};

export function loadConceptsToValidateSuccess(conceptsToValidate) {
  return {
    type: LOAD_CONCEPTS_TO_VALIDATE_SUCCESS,
    payload: {
      results: conceptsToValidate,
    },
  };
}

export function loadConceptsToValidateFailure(err) {
  return {
    type: LOAD_CONCEPTS_TO_VALIDATE_FAILURE,
    payload: err,
  };
}

//TODO should be rename to `validateConcept` and take a string with a unique
//concept id as an argument
export const validateConcepts = concepts => (dispatch, getState) => {
  dispatch({
    type: VALIDATE_CONCEPTS,
    status: PENDING,
    concepts,
  });
  return postConceptsToValidate(concepts).then(concepts =>
    dispatch(
      {
        type: VALIDATE_CONCEPTS_SUCCESS,
        status: OK,
        concepts,
      },
      err =>
        dispatch({
          type: VALIDATE_CONCEPTS_FAILURE,
          concepts,
          err,
        })
    )
  );
};
