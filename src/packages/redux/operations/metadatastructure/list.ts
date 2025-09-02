import { Dispatch } from 'redux';

import { OperationsApi } from '@sdk/operations-api';

import { getTree } from '../../../modules-operations/utils/msd';
import { loadCodesList } from '../../actions/operations/utils/setup';

export const LOAD_OPERATIONS_METADATASTRUCTURE_LIST =
	'LOAD_OPERATIONS_METADATASTRUCTURE_LIST';
export const LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS =
	'LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS';
export const LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE =
	'LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE';

const fetchMsd = () => (dispatch: Dispatch, getState: any) => {
	dispatch({
		type: LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
		payload: {},
	});
	return Promise.all([
		OperationsApi.getMetadataStructureList(),
		OperationsApi.getMetadataAttributesList(),
	]).then(
		([metaDataStructure, metadataAttributes]: [any, any]) => {
			const metadataAttributesObject = metadataAttributes.reduce(
				(acc: any, attr: any) => {
					return {
						...acc,
						[attr.id]: {
							...attr,
						},
					};
				},
				{},
			);
			const metaDataStructureTree = getTree(
				metaDataStructure,
				undefined,
				metadataAttributesObject,
			);
			const codesList = new Set();
			metadataAttributes
				.filter((attr: any) => attr.codeList)
				.map((attr: any) => attr.codeList)
				.filter(
					(code: any) =>
						Object.keys(getState().operationsCodesList.results).indexOf(code) <
						0,
				)
				.forEach((code: any) => codesList.add(code));
			loadCodesList(codesList, dispatch);

			dispatch({
				type: LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
				payload: { results: metaDataStructureTree },
			});
		},
		(err) =>
			dispatch({
				type: LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
				payload: { err },
			}),
	);
};
export default fetchMsd;
