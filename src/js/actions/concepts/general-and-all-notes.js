import loadGeneral from './general';
import loadAllNotes from './notes-all';

//TODO handle conceptVersion in the dedicated reducer to make it a number
export default id => dispatch =>
	dispatch(loadGeneral(id)).then(general => {
		dispatch(loadAllNotes(id, Number(general.conceptVersion) + 1));
	});
