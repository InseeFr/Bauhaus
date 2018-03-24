import D from 'js/i18n';

export const getColor = context => {
	switch (context) {
		case 'operations':
			return '#6f1417';
		case 'classifications':
		case 'concepts':
		default:
			return '#457DBB';
	}
};

export const getText = textType => {
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
