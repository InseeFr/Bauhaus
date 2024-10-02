import { screen } from '@testing-library/react';
import DocumentHome from './home';
import { Provider } from 'react-redux';
import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from '../../auth/roles';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';

describe('DocumentHome', () => {
	it('should display the PageTitle component', () => {
		const store = configureStore({
			users: { results: { stamp: 'stamp' } },
			app: { auth: { user: { roles: [] } } },
		});
		const { container } = renderWithRouter(
			<Provider store={store}>
				<DocumentHome documents={[]} />
			</Provider>,
		);
		expect(container.querySelectorAll('h1')).toHaveLength(1);
	});
	it('should display the SearchableList component', () => {
		const store = configureStore({
			users: { results: { stamp: 'stamp' } },
			app: { auth: { user: { roles: [] } } },
		});
		const { container } = renderWithRouter(
			<Provider store={store}>
				<DocumentHome documents={[]} />
			</Provider>,
		);
		expect(container.querySelectorAll('ul')).toHaveLength(1);
	});

	for (let right of [ADMIN, INDICATOR_CONTRIBUTOR, SERIES_CONTRIBUTOR]) {
		it(
			'should display two Add buttons if the user is an ' + right,
			async () => {
				const store = configureStore({
					users: { results: { stamp: 'stamp' } },
					app: { auth: { user: { roles: [right] } } },
				});
				renderWithRouter(
					<Provider store={store}>
						<DocumentHome documents={[]} />
					</Provider>,
				);
				await screen.findByText('New Document');
				await screen.findByText('New Link');
			},
		);
	}

	it('should not display any Add button if the user is an the right role,', () => {
		const store = configureStore({
			users: { results: { stamp: 'stamp' } },
			app: { auth: { user: { roles: ['other'] } } },
		});
		renderWithRouter(
			<Provider store={store}>
				<DocumentHome documents={[]} />
			</Provider>,
		);
		expect(screen.queryByText('New Document')).toBeNull();
		expect(screen.queryByText('New Link')).toBeNull();
	});
});
