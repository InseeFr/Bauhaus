import loadGeneral from './general';
import loadAllNotes from './notes-all';
import loadNarrowers from './narrowers';

export default (classificationId, itemId) => dispatch =>
	Promise.all([
		dispatch(loadGeneral(classificationId, itemId)).then(general => {
			general.conceptVersion &&
				dispatch(
					loadAllNotes(
						classificationId,
						itemId,
						Number(general.conceptVersion) + 1
					)
				);
		}),
		dispatch(loadNarrowers(classificationId, itemId)),
	]);
