import React from 'react';
import { render } from '@testing-library/react';
import DocumentHome from './home';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ADMIN, INDICATOR_CONTRIBUTOR, SERIES_CONTRIBUTOR } from 'bauhaus-utilities/src/auth/roles';

const mockStore = configureStore([]);

describe('DocumentHome', () => {
	it('should display the PageTitle component', () => {
		const store = mockStore({ users: { results: {stamp: 'stamp'}}, app: { auth: { user: { roles: [] } } } });
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
		const store = mockStore({ users: { results: {stamp: 'stamp'}}, app: { auth: { user: { roles: [] } } } });
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

	[ADMIN, INDICATOR_CONTRIBUTOR, SERIES_CONTRIBUTOR].forEach(right => {
		it('should display two Add buttons if the user is an ' + right, () => {
			const store = mockStore({ users: { results: {stamp: 'stamp'}}, app: { auth: { user: { roles: [right] } } } });
			const { getByText } = render(
				<Provider store={store}>
					<DocumentHome documents={[]} />
				</Provider>,
				{
					wrapper: MemoryRouter,
				}
			);
			expect(getByText("New Document")).toBeDefined();
			expect(getByText("New Link")).toBeDefined();
		})
	})

	it('should not display any Add button if the user is an the right role,', () => {
		const store = mockStore({ users: { results: {stamp: 'stamp'}}, app: { auth: { user: { roles: ["other"] } } } });
		const { queryByText } = render(
			<Provider store={store}>
				<DocumentHome documents={[]} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(queryByText("New Document")).toBeNull();
		expect(queryByText("New Link")).toBeNull();
	})
});
