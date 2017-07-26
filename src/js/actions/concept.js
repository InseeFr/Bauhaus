import {
  getConceptGeneral,
  getConceptNotes,
  getConceptLinks,
  postModifiedConcepts,
  postConcepts,
} from 'js/utils/remote-api';
import processUpdatePayload from './utils/process-update-concept-payload';

export const LOAD_CONCEPT_GENERAL = 'LOAD_CONCEPT_GENERAL';
export const LOAD_CONCEPT_GENERAL_SUCCESS = 'LOAD_CONCEPT_GENERAL_SUCCESS';
export const LOAD_CONCEPT_GENERAL_FAILURE = 'LOAD_CONCEPT_GENERAL_FAILURE';
export const LOAD_CONCEPT_LINKS = 'LOAD_CONCEPT_LINKS';
export const LOAD_CONCEPT_LINKS_SUCCESS = 'LOAD_CONCEPT_LINKS_SUCCESS';
export const LOAD_CONCEPT_LINKS_FAILURE = 'LOAD_CONCEPT_LINKS_FAILURE';
export const LOAD_CONCEPT_NOTES = 'LOAD_CONCEPT_NOTES';
export const LOAD_CONCEPT_NOTES_SUCCESS = 'LOAD_CONCEPT_NOTES_SUCCESS';
export const LOAD_CONCEPT_NOTES_FAILURE = 'LOAD_CONCEPT_NOTES_FAILURE';
export const CREATE_CONCEPT = 'CREATE_CONCEPT';
export const CREATE_CONCEPT_SUCCESS = 'CREATE_CONCEPT_SUCCESS';
export const CREATE_CONCEPT_FAILURE = 'CREATE_CONCEPT_FAILURE';
export const UPDATE_CONCEPT = 'UPDATE_CONCEPT';
export const UPDATE_CONCEPT_SUCCESS = 'UPDATE_CONCEPT_SUCCESS';
export const UPDATE_CONCEPT_FAILURE = 'UPDATE_CONCEPT_FAILURE';

export const loadConceptGeneral = id => (dispatch, getState) => {
  dispatch({
    type: LOAD_CONCEPT_GENERAL,
    payload: {
      id,
    },
  });
  return getConceptGeneral(id).then(
    conceptGeneral => {
      dispatch(loadConceptGeneralSuccess(id, conceptGeneral[0]));
      return conceptGeneral;
    },
    err => dispatch(loadConceptGeneralFailure(id, err.toString()))
  );
};

export function loadConceptGeneralSuccess(id, conceptGeneral) {
  return {
    type: LOAD_CONCEPT_GENERAL_SUCCESS,
    payload: {
      id,
      results: conceptGeneral,
    },
  };
}

export function loadConceptGeneralFailure(id, err) {
  return {
    type: LOAD_CONCEPT_GENERAL_FAILURE,
    payload: {
      id,
      err,
    },
  };
}

export const loadConceptLinks = id => (dispatch, getState) => {
  dispatch({
    type: LOAD_CONCEPT_LINKS,
    payload: {
      id,
    },
  });
  return getConceptLinks(id).then(
    conceptLinks => dispatch(loadConceptLinksSuccess(id, conceptLinks)),
    err => dispatch(loadConceptLinksFailure(id, err.toString()))
  );
};

export function loadConceptLinksSuccess(id, conceptGeneral) {
  return {
    type: LOAD_CONCEPT_LINKS_SUCCESS,
    payload: {
      id,
      results: conceptGeneral,
    },
  };
}

export function loadConceptLinksFailure(id, err) {
  return {
    type: LOAD_CONCEPT_LINKS_FAILURE,
    payload: {
      id,
      err,
    },
  };
}

export const loadConceptNotes = (id, conceptVersion) => (
  dispatch,
  getState
) => {
  dispatch({
    type: LOAD_CONCEPT_NOTES,
    payload: {
      id,
      conceptVersion,
    },
  });
  return getConceptNotes(id, conceptVersion).then(
    conceptNotes =>
      dispatch(loadConceptNotesSuccess(id, conceptVersion, conceptNotes)),
    err => dispatch(loadConceptNotesFailure(id, conceptVersion, err.toString()))
  );
};

export function loadConceptNotesSuccess(id, conceptVersion, conceptNotes) {
  return {
    type: LOAD_CONCEPT_NOTES_SUCCESS,
    payload: {
      id,
      conceptVersion,
      results: conceptNotes[0],
    },
  };
}

export function loadConceptNotesFailure(id, conceptVersion, err) {
  return {
    type: LOAD_CONCEPT_NOTES_FAILURE,
    payload: {
      id,
      conceptVersion,
      err,
    },
  };
}

export function loadConceptGeneralAndNotes(conceptId) {
  return (dispatch, getState) => {
    return dispatch(loadConceptGeneral(conceptId)).then(conceptGeneral => {
      dispatch(loadConceptNotes(conceptId, conceptGeneral[0].conceptVersion));
    });
  };
}

export function updateConcept(versioning, oldData, newData) {
  //TODO handle the status in the store (for now, we only handle the remote
  //call, and a `then` handler in the component take care of adjusting the
  //status)
  return dispatch => {
    const { general: { id } } = oldData;
    const payload = processUpdatePayload(versioning, oldData, newData);
    //TODO should not need to return the id (it should be read from the store)
    dispatch({
      type: UPDATE_CONCEPT,
      payload,
    });
    //TODO rename in remote api
    return postModifiedConcepts(id, payload).then(
      res => {
        dispatch({
          type: UPDATE_CONCEPT_SUCCESS,
          payload,
        });
      },
      err =>
        dispatch({
          type: UPDATE_CONCEPT_FAILURE,
          payload: {
            payload,
            err,
          },
        })
    );
  };
}

export function createConcept(data) {
  return dispatch => {
    dispatch({
      type: CREATE_CONCEPT,
      payload: {
        data,
      },
    });
    //TODO rename in remote api
    return postConcepts(data).then(
      res => {
        dispatch({
          type: CREATE_CONCEPT_SUCCESS,
          payload: data,
        });
      },
      err =>
        dispatch({
          type: CREATE_CONCEPT_FAILURE,
          payload: {
            err,
          },
        })
    );
  };
}
