import { ArrayUtils } from 'bauhaus-utilities';
import * as A from 'js/actions/constants';
import loadNotesByVersion from './notes-version';

export default (classificationId, itemId, lastVersion) => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_ITEM_NOTES_ALL,
		classificationId,
		itemId,
		lastVersion,
	});
	return Promise.all(
		ArrayUtils.range(1, lastVersion).map(version =>
			dispatch(loadNotesByVersion(classificationId, itemId, version))
		)
	).then(() =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_ALL_SUCCESS,
				classificationId,
				itemId,
				lastVersion,
			}),
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_ALL_FAILURE,
				classificationId,
				itemId,
				lastVersion,
				err,
			})
	);
};
