import listReducer, { getItems } from './utils/list-reducer';
import * as A from 'js/actions/constants';
import { combineReducers } from 'redux';
import conceptReducers from './concepts/';
import * as general from './concepts/by-id/general';
import * as notes from './concepts/by-id/notes';
import * as links from './concepts//by-id/links';
import collectionsList from './collections-list';
import collectionsToValidateList from './collections-to-validate-list';
import collectionGeneral from './collection-general';
import collectionMembers from './collection-members';
import remoteCalls, * as remoteCallsSelectors from './remote-calls';

const disseminationStatusList = listReducer([
  A.LOAD_DISSEMINATION_STATUS_LIST,
  A.LOAD_DISSEMINATION_STATUS_LIST_SUCCESS,
  A.LOAD_DISSEMINATION_STATUS_LIST_FAILURE,
]);

const stampList = listReducer([
  A.LOAD_STAMP_LIST,
  A.LOAD_STAMP_LIST_SUCCESS,
  A.LOAD_STAMP_LIST_FAILURE,
]);

export default combineReducers({
  stampList,
  disseminationStatusList,
  ...conceptReducers,
  collectionsList,
  collectionsToValidateList,
  collectionGeneral,
  collectionMembers,
  remoteCalls,
});

export const getConceptList = state => getItems(state.conceptList);
export const getConceptSearchList = state => getItems(state.conceptSearchList);
export const getConceptValidateList = state =>
  getItems(state.conceptToValidateList);
export const getDisseminationStatusList = state =>
  getItems(state.disseminationStatusList);
export const getStampList = state => getItems(state.stampList);

export const getGeneral = (state, id) =>
  general.getGeneral(state.conceptGeneral, id);
export const getNotes = (state, id, version) =>
  notes.getNotes(state.conceptNotes, id, version);
export const getLinks = (state, id) => links.getLinks(state.conceptLinks, id);

export function getAllNotes(state, id, lastVersion) {
  return notes.getAllNotes(state.conceptNotes, id, lastVersion);
}

export function getConcept(state, id) {
  const general = getGeneral(state, id);
  const links = getLinks(state, id);
  let notes;
  if (general) {
    notes = getNotes(state, id, general.conceptVersion);
  }

  if (!(general && notes && links)) return;

  return {
    general,
    notes,
    links,
  };
}

export const getStatus = (state, op) =>
  remoteCallsSelectors.getStatus(state.remoteCalls, op);

export const getNewlyCreatedId = state =>
  remoteCallsSelectors.getNewlyCreatedId(state.remoteCalls);
