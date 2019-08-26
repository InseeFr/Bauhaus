import listReducer from '../utils/list-reducer';
import collectionGeneral from './by-id/general';
import collectionMembers from './by-id/members';
import * as A from 'js/actions/constants';
import { handleReset } from 'js/reducers/utils/reset-reducer';

const collectionList = handleReset(
	listReducer([
		A.LOAD_COLLECTION_LIST,
		A.LOAD_COLLECTION_LIST_SUCCESS,
		A.LOAD_COLLECTION_LIST_FAILURE,
	]),
	[A.CREATE_COLLECTION, A.UPDATE_COLLECTION]
);

const collectionToValidateList = handleReset(
	listReducer([
		A.LOAD_COLLECTION_VALIDATE_LIST,
		A.LOAD_COLLECTION_VALIDATE_LIST_SUCCESS,
		A.LOAD_COLLECTION_VALIDATE_LIST_FAILURE,
	]),
	[A.CREATE_COLLECTION, A.UPDATE_COLLECTION, A.VALIDATE_COLLECTION_LIST]
);

export default {
	collectionList,
	collectionToValidateList,
	collectionGeneral,
	collectionMembers,
};
