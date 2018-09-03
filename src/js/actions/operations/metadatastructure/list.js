import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

import { getTree } from 'js/utils/msd';

export default () => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
		payload: {},
	});
	return Promise.all([
		api.getMetadataStructureList(),
		api.getMetadataAttributesList(),
	]).then(
		([metaDataStructure, metadataAttributes]) => {
			const metadataAttributesObject = metadataAttributes.reduce(
				(acc, attr) => {
					return {
						...acc,
						[attr.id]: {
							...attr,
						},
					};
				},
				{}
			);
			const metaDataStructureTree = getTree(
				metaDataStructure,
				undefined,
				metadataAttributesObject
			);

			dispatch({
				type: A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
				payload: { results: metaDataStructureTree },
			});
		},
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
				payload: { err },
			})
	);
};
