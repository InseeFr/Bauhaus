import Home from './home';

import { Provider } from 'react-redux';
import { ADMIN } from '../../../utils/auth/roles';
import configureStore from '../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

const store = configureStore({
	users: { results: { stamp: 'stamp' } },
	app: {
		secondLang: true,
		auth: {
			user: {
				roles: [ADMIN],
			},
		},
	},
});

const item = {
	general: {
		prefLabelLg1: 'Label',
		classificationId: 'id',
		itemId: 'itemId',
		conceptVersion: 'conceptVersion',
	},
	notes: {},
	narrowers: [{ id: '1', label: 'Narrower 1' }],
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-item-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Home item={item} langs={langs} secondLang={true} />
			</Provider>
		);
	});
});
