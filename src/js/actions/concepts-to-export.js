import FileSaver from 'file-saver';
import api from 'js/remote-api/api';

export const EXPORT_CONCEPT = 'EXPORT_CONCEPT';
export const EXPORT_CONCEPT_SUCCESS = 'EXPORT_CONCEPT_SUCCESS';
export const EXPORT_CONCEPT_FAILURE = 'EXPORT_CONCEPT_FAILURE';

export const EXPORT_MUTIPLE_CONCEPTS = 'EXPORT_MUTIPLE_CONCEPTS';
export const EXPORT_MUTIPLE_CONCEPTS_SUCCESS =
  'EXPORT_MUTIPLE_CONCEPTS_SUCCESS';
export const EXPORT_MUTIPLE_CONCEPTS_FAILURE =
  'EXPORT_MUTIPLE_CONCEPTS_FAILURE';

export const exportOneConcept = id => dispatch => {
  dispatch({
    type: EXPORT_CONCEPT,
    payload: { id },
  });
  //TODO FIX ME, we should iterate over the concepts
  const concept = id;
  return api
    .postConceptExport(concept)
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

export const exportMultipleConcepts = ids => dispatch => {
  dispatch({
    type: EXPORT_MUTIPLE_CONCEPTS,
    paylaod: {
      ids,
    },
  });
  return Promise.all(ids.map(id => dispatch(exportOneConcept(id)))).then(_ =>
    dispatch(
      {
        type: EXPORT_MUTIPLE_CONCEPTS_SUCCESS,
        payload: {
          ids,
        },
      },
      err =>
        dispatch({
          type: EXPORT_MUTIPLE_CONCEPTS_FAILURE,
          payload: {
            err,
            ids,
          },
        })
    )
  );
};
