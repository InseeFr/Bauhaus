import { getCollection, getCollectionMembers } from 'js/utils/remote-api';

export const LOAD_COLLECTION_GENERAL = 'LOAD_COLLECTION_GENERAL';
export const LOAD_COLLECTION_GENERAL_SUCCESS =
  'LOAD_COLLECTION_GENERAL_SUCCESS';
export const LOAD_COLLECTION_GENERAL_FAILURE =
  'LOAD_COLLECTION_GENERAL_FAILURE';
export const LOAD_COLLECTION_MEMBERS = 'LOAD_COLLECTION_MEMBERS';
export const LOAD_COLLECTION_MEMBERS_SUCCESS =
  'LOAD_COLLECTION_MEMBERS_SUCCESS';
export const LOAD_COLLECTION_MEMBERS_FAILURE =
  'LOAD_COLLECTION_MEMBERS_FAILURE';

export const loadCollectionGeneral = id => (dispatch, getState) => {
  dispatch({
    type: LOAD_COLLECTION_GENERAL,
    payload: {
      id,
    },
  });
  return getCollection(id).then(
    collectionGeneral =>
      dispatch(loadCollectionGeneralSuccess(id, collectionGeneral[0])),
    err => dispatch(loadCollectionGeneralFailure(id, err.toString()))
  );
};

export function loadCollectionGeneralSuccess(id, collectionGeneral) {
  return {
    type: LOAD_COLLECTION_GENERAL_SUCCESS,
    payload: {
      id,
      results: collectionGeneral,
    },
  };
}

export function loadCollectionGeneralFailure(id, err) {
  return {
    type: LOAD_COLLECTION_GENERAL_FAILURE,
    payload: {
      id,
      err,
    },
  };
}

export const loadCollectionMembers = id => (dispatch, getState) => {
  dispatch({
    type: LOAD_COLLECTION_MEMBERS,
    payload: {
      id,
    },
  });
  return getCollectionMembers(id).then(
    collectionMembers =>
      dispatch(loadCollectionMembersSuccess(id, collectionMembers)),
    err => dispatch(loadCollectionGeneralFailure(id, err.toString()))
  );
};

export function loadCollectionMembersSuccess(id, collectionMembers) {
  return {
    type: LOAD_COLLECTION_MEMBERS_SUCCESS,
    payload: {
      id,
      results: collectionMembers,
    },
  };
}

export function loadCollectionMembersFailure(id, err) {
  return {
    type: LOAD_COLLECTION_MEMBERS_FAILURE,
    payload: {
      id,
      err,
    },
  };
}
