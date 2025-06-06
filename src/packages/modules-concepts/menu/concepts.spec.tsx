import { screen } from '@testing-library/dom';
import { Provider } from 'react-redux';

import { ADMIN } from '../../auth/roles';
import D from '../../deprecated-locales';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests/render';
import MenuConcepts from './index';

describe('menu-concepts', () => {
	it('should display the administrion menu', () => {
		const store = configureStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: [ADMIN],
					},
				},
			},
		});

		renderWithRouter(
			<Provider store={store}>
				<MenuConcepts />
			</Provider>,
			['/concepts'],
		);
		const links = screen.getAllByRole('link');

		expect(links).toHaveLength(5);
		expect(links[3].textContent).toBe(D.administrationTitle);
	});

	it('should not display the administrion menu', () => {
		const store = configureStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: [],
					},
				},
			},
		});

		renderWithRouter(
			<Provider store={store}>
				<MenuConcepts />
			</Provider>,
			['/concepts'],
		);
		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(4);
	});
});
