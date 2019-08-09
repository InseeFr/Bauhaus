import api from 'js/remote-api/api';
import * as A from './constants';

export default () => dispatch => {
	dispatch({
		type: A.LOAD_STAMP_LIST,
		payload: {},
	});
	return api.getStampList().then(
		results => {
			dispatch({
				type: A.LOAD_STAMP_LIST_SUCCESS,
				payload: { results },
			});
		},
		err =>
			dispatch({
				type: A.LOAD_STAMP_LIST_FAILURE,
				payload: { err },
			})
	);
};
