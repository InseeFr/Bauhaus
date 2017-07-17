import { combineReducers } from 'redux';
import stampsList from './stamps-list';
import disseminationStatusList from './dissemination-status-list';
import conceptsList from './concepts-list';
import conceptsSearchList from './concepts-search-list';
import conceptsToValidateList from './concepts-to-validate-list';
import conceptGeneral from './concept-general';
import conceptLinks from './concept-links';
import conceptNotes from './concept-notes';
import collectionsList from './collections-list';
import collectionsToValidateList from './collections-to-validate-list';
import collectionGeneral from './collection-general';
import collectionMembers from './collection-members';

export default combineReducers({
  stampsList,
  disseminationStatusList,
  conceptsList,
  conceptsSearchList,
  conceptsToValidateList,
  conceptGeneral,
  conceptLinks,
  conceptNotes,
  collectionsList,
  collectionsToValidateList,
  collectionGeneral,
  collectionMembers,
});

export function getConceptGeneral(state, conceptId) {}
