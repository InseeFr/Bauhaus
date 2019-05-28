export const getOperationsOrganisations = state => {
	const organisations = state.operationsOrganisations || {};
	return organisations.results || [];
};

export const getOperationsCodesList = state => {
	const operationsCodesList = state.operationsCodesList || {};
	return operationsCodesList.results || [];
};

export const getOperationsDocuments = (state, group = 'full') => {
	if (!state.operationsDocuments.results) {
		return [];
	}
	return state.operationsDocuments.results[group] || [];
};

export const getOperationsDocumentsStatus = state => {
	return state.operationsDocuments.status;
};
