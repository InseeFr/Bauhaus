import loadGeneral from './general';
import loadLinks from './links';
import loadAllNotes from './notes-all';

//TODO handle conceptVersion in the dedicated reducer to make it a number
export default id => dispatch =>
	dispatch(loadGeneral(id))
		.then(general => {
			const { conceptVersion } = general;
			dispatch(loadAllNotes(id, Number(conceptVersion)));
		})
		.then(() => dispatch(loadLinks(id)));
