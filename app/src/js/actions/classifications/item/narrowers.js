import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default (classificationId, itemId) => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_ITEM_NARROWERS,
		payload: {
			classificationId,
			itemId,
		},
	});
	return api.getClassificationItemNarrowers(classificationId, itemId).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEM_NARROWERS_SUCCESS,
				payload: { classificationId, itemId, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEM_NARROWERS_FAILURE,
				payload: { err, classificationId, itemId },
			})
	);
};
