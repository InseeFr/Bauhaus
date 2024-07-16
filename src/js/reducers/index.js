import { combineReducers } from 'redux';
import app from '../store/users';
import classificationsReducers from './classifications';
import operationsReducers from './operations';
import codesListReducers from './operations/codesList';
import organisationsReducers from './operations/organisations';
import { Stores } from '../utils';
import remoteCalls from './remote-calls';

export default combineReducers({
	app,
	...classificationsReducers,
	...operationsReducers,
	...codesListReducers,
	...organisationsReducers,
	geographies: Stores.Geographies.reducer,
	disseminationStatus: Stores.DisseminationStatus.reducer,
	users: Stores.UsersAction.reducer,
	remoteCalls,
});

export const getLangs = (state) => {
	const { lg1, lg2 } = state.app;
	return { lg1, lg2 };
};

export const getStatus = (state, op) =>
	Stores.RemoteCalls.getStatus(state.remoteCalls, op);

export const getError = (state, op) =>
	Stores.RemoteCalls.getError(state.remoteCalls, op);

export const getNewlyCreatedId = (state) =>
	Stores.RemoteCalls.getNewlyCreatedId(state.remoteCalls);

export const getSerie = (state) => {
	return state.operationsSeriesCurrent || {};
};

export const getIndicator = (state) => {
	return state.operationsIndicatorsCurrent || {};
};

export const getOperationsSimsCurrent = (state) => {
	return state.operationsSimsCurrent || {};
};
