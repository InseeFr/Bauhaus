export const getOperationsOrganisations = (state) => {
	const organisations = state.operationsOrganisations || {};
	return organisations.results || [];
};

export const getOperationsCodesList = (state) => {
	const operationsCodesList = state.operationsCodesList || {};
	return operationsCodesList.results || [];
};
