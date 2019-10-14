import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

import { getPublishFactory, getItemFactory } from '../utils';

export const publishIndicator = getPublishFactory(
	api.publishIndicator,
	A.PUBLISH_OPERATIONS_INDICATOR,
	A.PUBLISH_OPERATIONS_INDICATOR_SUCCESS,
	A.PUBLISH_OPERATIONS_INDICATOR_FAILURE
);

export const saveIndicator = (indicator, callback) => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_INDICATOR,
		payload: indicator,
	});
	const method = indicator.id ? 'putIndicator' : 'postIndicator';

	return api[method](indicator).then(
		results => {
			dispatch({
				type: A.SAVE_OPERATIONS_INDICATOR_SUCCESS,
				payload: {
					id: results,
					prefLabelLg1: indicator.prefLabelLg1,
					altLabel: indicator.altLabelLg1,
				},
			});
			callback(null, results);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_INDICATOR_FAILURE,
				payload: { err },
			});
			callback(err);
		}
	);
};

export default getItemFactory(
	api.getIndicator,
	A.LOAD_OPERATIONS_INDICATOR,
	A.LOAD_OPERATIONS_INDICATOR_SUCCESS,
	A.LOAD_OPERATIONS_INDICATORS_LIST_FAILURE
);
