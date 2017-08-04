import api from 'js/remote-api/api';
import * as A from '../constants';

export default id => dispatch => {
  dispatch({
    type: A.LOAD_CONCEPT_LINKS,
    payload: {
      id,
    },
  });
  return api.getConceptLinkList(id).then(
    results => {
      dispatch({
        type: A.LOAD_CONCEPT_LINKS_SUCCESS,
        payload: { id, results },
      });
      return results;
    },
    err =>
      dispatch({ type: A.LOAD_CONCEPT_LINKS_FAILURE, payload: { err, id } })
  );
};
