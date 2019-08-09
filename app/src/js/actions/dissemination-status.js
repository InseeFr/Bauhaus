import api from 'js/remote-api/api';
import * as A from './constants';

export default () => dispatch => {
	dispatch({
		type: A.LOAD_DISSEMINATION_STATUS_LIST,
		payload: {},
	});
	return api.getDissStatusList().then(
		results => {
			dispatch({
				type: A.LOAD_DISSEMINATION_STATUS_LIST_SUCCESS,
				payload: { results },
			});
		},
		err =>
			dispatch({
				type: A.LOAD_DISSEMINATION_STATUS_LIST_FAILURE,
				payload: { err },
			})
	);
};
