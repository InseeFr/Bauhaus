import FileSaver from 'file-saver';
import { postConceptsToExport } from 'js/utils/remote-api';

export const EXPORT_CONCEPT = 'EXPORT_CONCEPTS';
export const EXPORT_CONCEPT_SUCCESS = 'EXPORT_CONCEPTS_SUCCESS';
export const EXPORT_CONCEPT_FAILURE = 'EXPORT_CONCEPTS_FAILURE';

export const exportConcept = id => dispatch => {
  dispatch({
    type: EXPORT_CONCEPT,
    payload: { id },
  });
  //TODO FIX ME, we should iterate over the concepts
  const concept = id;
  postConceptsToExport(concept)
    .then(res => res.blob())
    .then(blob => {
      return FileSaver.saveAs(blob, `${id}.pdf`);
    })
    .then(() => {
      dispatch(
        {
          type: EXPORT_CONCEPT_SUCCESS,
          payload: {
            id,
          },
        },
        err =>
          dispatch({
            type: EXPORT_CONCEPT_FAILURE,
            payload: {
              err,
              id,
            },
          })
      );
    });
};
