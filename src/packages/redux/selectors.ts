import { ReduxModel } from './model';

export const getPermission = (state: ReduxModel) => {
	const {
		type: authType,
		user: { roles, stamp },
	} = state.app!.auth;
	return { authType, roles, stamp };
};

export const getLocales = (state: ReduxModel) => {
	const { lg1, lg2 } = state.app!;
	return { lg1, lg2 };
};
export const getSerie = (state: ReduxModel) => {
	return state.operationsSeriesCurrent || {};
};

export const getIndicator = (state: ReduxModel) => {
	return state.operationsIndicatorsCurrent || {};
};

export const getOperationsSimsCurrent = (state: ReduxModel) => {
	return state.operationsSimsCurrent || {};
};
