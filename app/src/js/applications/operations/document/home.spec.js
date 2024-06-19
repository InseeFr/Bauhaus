import React from 'react';
import { render, screen } from '@testing-library/react';
import DocumentHome from './home';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from 'js/utils/auth/roles';

const mockStore = configureStore([]);

describe('DocumentHome', () => {
	it('should display the PageTitle component', () => {
		const store = mockStore({
			users: { results: { stamp: 'stamp' } },
			app: { auth: { user: { roles: [] } } },
		});
		const { container } = render(
			<Provider store={store}>
				<DocumentHome documents={[]} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(container.querySelectorAll('h1')).toHaveLength(1);
	});
	it('should display the SearchableList component', () => {
		const store = mockStore({
			users: { results: { stamp: 'stamp' } },
			app: { auth: { user: { roles: [] } } },
		});
		const { container } = render(
			<Provider store={store}>
				<DocumentHome documents={[]} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(container.querySelectorAll('ul')).toHaveLength(1);
	});

	for (let right of [ADMIN, INDICATOR_CONTRIBUTOR, SERIES_CONTRIBUTOR]) {
		it(
			'should display two Add buttons if the user is an ' + right,
			async () => {
				const store = mockStore({
					users: { results: { stamp: 'stamp' } },
					app: { auth: { user: { roles: [right] } } },
				});
				render(
					<Provider store={store}>
						<DocumentHome documents={[]} />
					</Provider>,
					{
						wrapper: MemoryRouter,
					}
				);
				await screen.findByText('New Document');
				await screen.findByText('New Link');
			}
		);
	}

	it('should not display any Add button if the user is an the right role,', () => {
		const store = mockStore({
			users: { results: { stamp: 'stamp' } },
			app: { auth: { user: { roles: ['other'] } } },
		});
		render(
			<Provider store={store}>
				<DocumentHome documents={[]} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
		// eslint-disable-next-line jest-dom/prefer-in-document
		expect(screen.queryByText('New Document')).toBeNull();
		// eslint-disable-next-line jest-dom/prefer-in-document
		expect(screen.queryByText('New Link')).toBeNull();
	});
});
