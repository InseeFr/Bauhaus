export const getText = (textType, D) => {
	switch (textType) {
		case 'authentification':
			return D.loadableAuth;
		case 'saving':
			return D.loadableSaving;
		case 'sending':
			return D.loadableSending;
		case 'exporting':
			return D.loadableExporting;
		case 'validating':
			return D.loadableValidating;
		case 'loading':
		default:
			return D.loadableLoading;
	}
};
