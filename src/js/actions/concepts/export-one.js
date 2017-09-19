import api from 'js/remote-api/concepts-api';
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
          //we do not want to save the pdf within the reducer, so we return
          //it in order to process it later
          return blob;
        },
        err => dispatch({ type: A.EXPORT_CONCEPT_FAILURE, payload: { err } })
      )
      //TODO Is it the best place ? We do not want to keep track of the blobs
      //within the reducer. Another option could be to define the `then`
      //handler in the component which calls the action, but it is not clean.
      .then(blob => {
        return FileSaver.saveAs(blob, `concept-${id}.pdf`);
      })
  );
};
