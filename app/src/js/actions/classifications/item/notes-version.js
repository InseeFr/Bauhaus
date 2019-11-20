import api from 'js/remote-api/classifications-api';
import { rmesHtmlToRawHtml } from 'js/utils/html';
import { emptyNotes } from 'js/applications/classifications/utils/item/notes';
import * as A from 'js/actions/constants';

export default (classificationId, itemId, version) => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION,
		payload: {
			classificationId,
			itemId,
			version,
		},
	});
	return api.getClassificationItemNotes(classificationId, itemId, version).then(
		notes =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_SUCCESS,
				payload: {
					classificationId,
					itemId,
					version,
					results: Object.assign(
						{},
						emptyNotes,
						Object.keys(notes).reduce((formatted, noteName) => {
							formatted[noteName] = rmesHtmlToRawHtml(notes[noteName]);
							return formatted;
						}, {})
					),
				},
			}),
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_FAILURE,
				payload: { err, classificationId, itemId, version },
			})
	);
};
