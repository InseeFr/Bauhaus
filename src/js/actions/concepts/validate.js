import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

export default ids => dispatch => {
  dispatch({
    type: A.VALIDATE_CONCEPT_LIST,
    payload: {
      ids,
    },
  });
  return api.putConceptValidList(ids).then(
    res =>
      dispatch({
        type: A.VALIDATE_CONCEPT_LIST_SUCCESS,
        payload: { ids },
      }),
    err =>
      dispatch({ type: A.VALIDATE_CONCEPT_LIST_FAILURE, payload: { err, ids } })
  );
};
