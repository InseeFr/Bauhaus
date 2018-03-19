import loadLinks from './links';
import loadGeneral from './general';

export default id => dispatch => {
	return Promise.all([dispatch(loadGeneral(id)), dispatch(loadLinks(id))]);
};
