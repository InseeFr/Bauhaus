export const getOperationsOrganisations = (state: any) => {
	const organisations = state.operationsOrganisations || {};
	return organisations.results || [];
};

export const getOperationsCodesList = (state: any) => {
	const operationsCodesList = state.operationsCodesList || {};
	return operationsCodesList.results || [];
};
