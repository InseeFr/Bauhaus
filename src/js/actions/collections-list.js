import {
	getCollectionsList,
	getCollectionsToValidateList,
} from 'js/utils/remote-api';

export const LOAD_COLLECTIONS_LIST = 'LOAD_COLLECTIONS_LIST';
export const LOAD_COLLECTIONS_LIST_SUCCESS = 'LOAD_COLLECTIONS_LIST_SUCCESS';
export const LOAD_COLLECTIONS_LIST_FAILURE = 'LOAD_COLLECTIONS_LIST_FAILURE';
export const LOAD_COLLECTIONS_TO_VALIDATE_LIST =
	'LOAD_COLLECTIONS_TO_VALIDATE_LIST';
export const LOAD_COLLECTIONS_TO_VALIDATE_LIST_SUCCESS =
	'LOAD_COLLECTIONS_TO_VALIDATE_LIST_SUCCESS';
export const LOAD_COLLECTIONS_TO_VALIDATE_LIST_FAILURE =
	'LOAD_COLLECTIONS_TO_VALIDATE_LIST_FAILURE';

export const loadCollectionsList = () => (dispatch, getState) => {
	dispatch({
		type: LOAD_COLLECTIONS_LIST,
		payload: null,
	});
	return getCollectionsList().then(
		collectionsList => dispatch(loadCollectionsListSuccess(collectionsList)),
		err => dispatch(loadCollectionsListFailure({ err: err.toString() }))
	);
};

export function loadCollectionsListSuccess(collectionsList) {
	return {
		type: LOAD_COLLECTIONS_LIST_SUCCESS,
		payload: {
			results: collectionsList,
		},
	};
}

export function loadCollectionsListFailure(err) {
	return {
		type: LOAD_COLLECTIONS_LIST_FAILURE,
		payload: err,
	};
}

export const loadCollectionsToValidateList = () => (dispatch, getState) => {
	dispatch({
		type: LOAD_COLLECTIONS_TO_VALIDATE_LIST,
		payload: null,
	});
	return getCollectionsToValidateList().then(
		collectionsToValidateList =>
			dispatch(loadCollectionsToValidateListSuccess(collectionsToValidateList)),
		err => dispatch(loadCollectionsToValidateListFailure(err.toString()))
	);
};

export function loadCollectionsToValidateListSuccess(
	collectionsToValidateList
) {
	return {
		type: LOAD_COLLECTIONS_TO_VALIDATE_LIST_SUCCESS,
		payload: {
			results: collectionsToValidateList,
		},
	};
}

export function loadCollectionsToValidateListFailure(err) {
	return {
		type: LOAD_COLLECTIONS_TO_VALIDATE_LIST_FAILURE,
		payload: err,
	};
}
