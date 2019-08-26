import loadMembers from './members';
import loadGeneral from './general';

export default id => dispatch => {
	//handy to return a promise in case we want to chain other actions
	return Promise.all([dispatch(loadGeneral(id)), dispatch(loadMembers(id))]);
};
