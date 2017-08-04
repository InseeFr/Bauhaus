import api from 'js/remote-api/api';
import * as A from '../constants';
import FileSaver from 'file-saver';
export default id => dispatch => {
  dispatch({
    type: A.EXPORT_CONCEPT,
    payload: id,
  });
  return (
    api
      .getConceptExport(id)
      .then(
        blob => {
          dispatch({ type: A.EXPORT_CONCEPT_SUCCESS });
          return blob;
        },
        err => dispatch({ type: A.EXPORT_CONCEPT_FAILURE, payload: { err } })
      )
      //TODO Is it the best place ? We do not want to keep track of the blobs
      //within the reducer.
      .then(blob => {
        return FileSaver.saveAs(blob, `concept-${id}.pdf`);
      })
  );
};
