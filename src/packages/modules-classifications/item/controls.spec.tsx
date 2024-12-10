import { Provider } from 'react-redux';

import { ADMIN } from '../../auth/roles';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';
import Controls from './controls';

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

describe('classification-item-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<Controls classificationId="nafr2" itemId="A" version={1} />
			</Provider>,
		);
	});
});
