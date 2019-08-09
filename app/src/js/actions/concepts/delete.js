import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

export default id => dispatch => {
	dispatch({
		type: A.DELETE_CONCEPT,
		payload: {
			id,
		},
	});
	return api.deleteConcept(id).then(
		res => {
			dispatch({
				type: A.DELETE_CONCEPT_SUCCESS,
				payload: { id },
			});
		},
		err =>
			dispatch({
				type: A.DELETE_CONCEPT_FAILURE,
				payload: { err, id },
			})
	);
};
