import api from 'js/remote-api/concepts-api';
import { rmesHtmlToRawHtml } from 'js/utils/html';
import { emptyNotes } from 'js/utils/concepts/notes';
import * as A from '../constants';

export default (id, version) => dispatch => {
	dispatch({
		type: A.LOAD_NOTES_VERSION,
		payload: {
			id,
			version,
		},
	});
	return api.getNoteVersionList(id, version).then(
		notes =>
			dispatch({
				type: A.LOAD_NOTES_VERSION_SUCCESS,
				payload: {
					id,
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
				type: A.LOAD_NOTES_VERSION_FAILURE,
				payload: { err, id, version },
			})
	);
};
