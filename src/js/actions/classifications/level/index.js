import loadGeneral from './general';
import loadMembers from './members';

export default (classificationId, levelId) => dispatch =>
	Promise.all([
		dispatch(loadGeneral(classificationId, levelId)),
		dispatch(loadMembers(classificationId, levelId)),
	]);
