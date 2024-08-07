import { combineReducers } from 'redux';
import app from '../new-architecture/redux/users';
import classificationsReducers from './classifications';
import operationsReducers from './operations';
import codesListReducers from './operations/codesList';
import organisationsReducers from './operations/organisations';
import { Stores } from '../utils';

export default combineReducers({
	app,
	...classificationsReducers,
	...operationsReducers,
	...codesListReducers,
	...organisationsReducers,
	geographies: Stores.Geographies.reducer,
	users: Stores.UsersAction.reducer,
});

export const getLangs = (state) => {
	const { lg1, lg2 } = state.app;
	return { lg1, lg2 };
};
export const getSerie = (state) => {
	return state.operationsSeriesCurrent || {};
};

export const getIndicator = (state) => {
	return state.operationsIndicatorsCurrent || {};
};

export const getOperationsSimsCurrent = (state) => {
	return state.operationsSimsCurrent || {};
};
