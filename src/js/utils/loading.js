import { dictionary } from 'js/utils/dictionary';

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
			return dictionary.loadable.authentification;
		case 'saving':
			return dictionary.loadable.saving;
		case 'sending':
			return dictionary.loadable.sending;
		case 'exporting':
			return dictionary.loadable.exporting;
		case 'validating':
			return dictionary.loadable.validation;
		case 'loading':
		default:
			return dictionary.loadable.loading;
	}
};
