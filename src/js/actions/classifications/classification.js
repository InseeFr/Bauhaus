import loadGeneral from './general';
import loadLevels from './levels';

export default id => dispatch =>
	Promise.all([dispatch(loadGeneral(id)), dispatch(loadLevels(id))]);
