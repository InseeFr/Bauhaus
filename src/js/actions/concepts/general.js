import api from 'js/remote-api/api';
import * as A from '../constants';

export default id => dispatch => {
  dispatch({
    type: A.LOAD_CONCEPT_GENERAL,
    payload: {
      id,
    },
  });
  return api.getConceptGeneral(id).then(
    results => {
      dispatch({
        type: A.LOAD_CONCEPT_GENERAL_SUCCESS,
        payload: { id, results },
      });
      return results;
    },
    err =>
      dispatch({ type: A.LOAD_CONCEPT_GENERAL_FAILURE, payload: { err, id } })
  );
};
