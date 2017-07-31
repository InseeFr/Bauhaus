import loadGeneral from './general';
import loadNotes from './notes-version';

export default id => dispatch =>
  dispatch(loadGeneral(id)).then(general => {
    dispatch(loadNotes(id, general.conceptVersion));
  });
