export const CREATE_CONCEPT = 'CREATE_CONCEPT';

export const getStatus = (state, actionType) => {
	return state[actionType] && state[actionType].status;
};

export const getError = (state, actionType) => {
	return state[actionType] && state[actionType].err;
};

export const getNewlyCreatedId = state =>
	state[CREATE_CONCEPT] && state[CREATE_CONCEPT].id;
