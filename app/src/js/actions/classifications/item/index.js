import loadGeneral from './general';
import loadAllNotes from './notes-all';

export default (classificationId, itemId) => dispatch =>
	dispatch(loadGeneral(classificationId, itemId)).then(general => {
		general.conceptVersion &&
		dispatch(
			loadAllNotes(
				classificationId,
				itemId,
				Number(general.conceptVersion) + 1
			)
		);
	})
