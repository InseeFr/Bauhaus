import {
  getConceptGeneral,
  getConceptNotes,
  getConceptLinks,
} from '../utils/remote-api';

export const LOAD_CONCEPT_GENERAL = 'LOAD_CONCEPT_GENERAL';
export const LOAD_CONCEPT_GENERAL_SUCCESS = 'LOAD_CONCEPT_GENERAL_SUCCESS';
export const LOAD_CONCEPT_GENERAL_FAILURE = 'LOAD_CONCEPT_GENERAL_FAILURE';
export const LOAD_CONCEPT_LINKS = 'LOAD_CONCEPT_LINKS';
export const LOAD_CONCEPT_LINKS_SUCCESS = 'LOAD_CONCEPT_LINKS_SUCCESS';
export const LOAD_CONCEPT_LINKS_FAILURE = 'LOAD_CONCEPT_LINKS_FAILURE';
export const LOAD_CONCEPT_NOTES = 'LOAD_CONCEPT_NOTES';
export const LOAD_CONCEPT_NOTES_SUCCESS = 'LOAD_CONCEPT_NOTES_SUCCESS';
export const LOAD_CONCEPT_NOTES_FAILURE = 'LOAD_CONCEPT_NOTES_FAILURE';

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
      dispatch(loadConceptNotesSuccess(id, conceptVersion, conceptNotes[0])),
    err => dispatch(loadConceptNotesFailure(id, conceptVersion, err.toString()))
  );
};

export function loadConceptNotesSuccess(id, conceptVersion, conceptNotes) {
  return {
    type: LOAD_CONCEPT_NOTES_SUCCESS,
    payload: {
      id,
      conceptVersion,
      results: conceptNotes,
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
