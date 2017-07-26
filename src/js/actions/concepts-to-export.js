import { postConceptsToExport } from 'js/utils/remote-api';

import { PENDING, OK } from 'js/constants';

export const EXPORT_CONCEPTS = 'EXPORT_CONCEPTS';
export const EXPORT_CONCEPTS_SUCCESS = 'EXPORT_CONCEPTS_SUCCESS';
export const EXPORT_CONCEPTS_FAILURE = 'EXPORT_CONCEPTS_FAILURE';

export const exportConcepts = concepts => (dispatch, getState) => {
  dispatch({
    type: EXPORT_CONCEPTS,
    status: PENDING,
    concepts,
  });
  return postConceptsToExport(concepts).then(concepts =>
    dispatch(
      {
        type: EXPORT_CONCEPTS_SUCCESS,
        status: OK,
        concepts,
      },
      err =>
        dispatch({
          type: EXPORT_CONCEPTS_FAILURE,
          concepts,
          err,
        })
    )
  );
};
