import loadLinks from './links';
import loadNotes from './notes-version';
import loadGeneral from './general';

export default id => dispatch =>
	Promise.all([
		dispatch(loadGeneral(id)).then(({ conceptVersion }) =>
			dispatch(loadNotes(id, conceptVersion))
		),
		dispatch(loadLinks(id)),
	]);
