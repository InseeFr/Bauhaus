import api from 'js/remote-api/api';
import * as A from '../constants';

export default id => dispatch => {
  dispatch({
    type: A.CREATE_CONCEPT,
    payload: id,
  });
  return api
    .getConceptExport(id)
    .then(
      blob => dispatch({ type: A.CREATE_CONCEPT_SUCCESS }),
      err => dispatch({ type: A.EXPORT_CONCEPT_FAILURE, payload: { err } })
    );
};
