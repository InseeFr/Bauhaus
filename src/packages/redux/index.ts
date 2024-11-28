import { combineReducers } from 'redux';

import classificationsReducers from './classifications';
import { reducer as geographiesReducer } from './geographies.action';
import operationsReducers from './operations';
import codesListReducers from './operations/codesList';
import app from './users';

export default combineReducers({
	app,
	...classificationsReducers,
	...operationsReducers,
	...codesListReducers,
	geographies: geographiesReducer,
});
