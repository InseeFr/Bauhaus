import api from 'js/remote-api/concepts-api';
import * as A from '../constants';

export default (id, concept) => dispatch => {
	dispatch({
		type: A.UPDATE_CONCEPT,
		payload: {
			id,
			concept,
		},
	});
	return api.putConcept(id, concept).then(
		res => {
			dispatch({
				type: A.UPDATE_CONCEPT_SUCCESS,
				payload: { id, concept },
			});
		},
		err =>
			dispatch({
				type: A.UPDATE_CONCEPT_FAILURE,
				payload: { err, id, concept },
			})
	);
};
