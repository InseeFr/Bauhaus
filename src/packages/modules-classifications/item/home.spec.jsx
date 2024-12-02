import { Provider } from 'react-redux';

import { ADMIN } from '../../auth/roles';
import configureStore from '../../redux/configure-store';
import { locales } from '../../tests-utils/default-values';
import { renderWithAppContext } from '../../tests-utils/render';
import Home from './home';

const store = configureStore({
	users: { results: { stamp: 'stamp' } },
	app: {
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

describe('classification-item-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<Provider store={store}>
				<Home item={item} langs={locales} secondLang={true} />
			</Provider>,
		);
	});
});
