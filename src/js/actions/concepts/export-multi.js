import exportOne from './export-one';
import * as A from '../constants';

export default ids => dispatch => {
  dispatch({
    type: A.EXPORT_CONCEPT_LIST,
    paylaod: {
      ids,
    },
  });
  return Promise.all(ids.map(id => dispatch(exportOne(id)))).then(_ =>
    dispatch(
      {
        type: A.EXPORT_CONCEPT_LIST_SUCCESS,
        payload: {
          ids,
        },
      },
      err =>
        dispatch({
          type: A.EXPORT_CONCEPT_LIST_FAILURE,
          payload: {
            err,
            ids,
          },
        })
    )
  );
};
