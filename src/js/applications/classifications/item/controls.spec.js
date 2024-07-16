import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';
import { ADMIN } from '../../../utils/auth/roles';
import { Provider } from 'react-redux';
import configureStore from '../../../store/configure-store';

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
		render(
			<Provider store={store}>
				<Controls classificationId="nafr2" itemId="A" version={'1'} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
