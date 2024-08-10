import { combineReducers } from 'redux';
import app from './users';
import classificationsReducers from './classifications';
import operationsReducers from './operations';
import codesListReducers from './operations/codesList';
import organisationsReducers from './operations/organisations';
import { Stores } from '../../utils';

export default combineReducers({
	app,
	...classificationsReducers,
	...operationsReducers,
	...codesListReducers,
	...organisationsReducers,
	geographies: Stores.Geographies.reducer,
	users: Stores.UsersAction.reducer,
});
