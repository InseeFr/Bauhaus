import loadGeneral from './general';
import loadMembers from './members';

export default id => dispatch =>
	Promise.all([dispatch(loadGeneral(id)), dispatch(loadMembers(id))]);
