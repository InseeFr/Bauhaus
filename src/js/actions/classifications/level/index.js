import loadGeneral from './general';
import loadMembers from './members';

const fetchClassification = (classificationId, levelId) => (dispatch) =>
	Promise.all([
		dispatch(loadGeneral(classificationId, levelId)),
		dispatch(loadMembers(classificationId, levelId)),
	]);

export default fetchClassification;
