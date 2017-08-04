import api from 'js/remote-api/api';
import * as A from '../constants';

export default (id, mailInfo) => dispatch => {
  dispatch({
    type: A.SEND_CONCEPT,
    payload: {
      mailInfo,
    },
  });
  return api.postConceptSend(id, mailInfo).then(
    id => dispatch({ type: A.SEND_CONCEPT_SUCCESS, payload: { id, mailInfo } }),
    err =>
      dispatch({
        type: A.SEND_CONCEPT_FAILURE,
        payload: { err, id, mailInfo },
      })
  );
};
