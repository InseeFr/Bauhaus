import { combineReducers } from 'redux';
import app from './users';
import classificationsReducers from './classifications';
import operationsReducers from './operations';
import codesListReducers from './operations/codesList';
import organisationsReducers from './operations/organisations';
import { reducer } from './users.action';
import { reducer as geographiesReducer } from './geographies.action';

export default combineReducers({
	app,
	...classificationsReducers,
	...operationsReducers,
	...codesListReducers,
	...organisationsReducers,
	geographies: geographiesReducer,
	users: reducer,
});
