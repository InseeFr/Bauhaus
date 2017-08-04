import api from 'js/remote-api/api';
import * as A from '../constants';

export default concept => dispatch => {
  dispatch({
    type: A.CREATE_CONCEPT,
    payload: {
      concept,
    },
  });
  return api
    .postConcept(concept)
    .then(
      id =>
        dispatch({ type: A.CREATE_CONCEPT_SUCCESS, payload: { id, concept } }),
      err =>
        dispatch({ type: A.CREATE_CONCEPT_FAILURE, payload: { err, concept } })
    );
};
