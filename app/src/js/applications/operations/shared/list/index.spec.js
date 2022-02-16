import React from 'react';
import { render, screen } from '@testing-library/react';
import OperationsObjectHome from './index';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('Operation Home', () => {
	it('should display the PageTitle component', () => {
		const store = mockStore({ users: { results: { stamp: 'stamp' }}, app: { auth: { user: { roles: [] } } } });

		const { container } = render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createURL=""
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);

		expect(container.querySelectorAll('h1')).toHaveLength(1);
	});
	it('should display the SearchableList component', () => {
		const store = mockStore({ users: { results: { stamp: 'stamp' }}, app: { auth: { user: { roles: [] } } } });

		const { container } = render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createURL=""
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		expect(container.querySelectorAll('.list-group')).toHaveLength(1);
	});

	it('should always display the Tree button', async () => {
		const store = mockStore({ users: { results: { stamp: 'stamp' }}, app: { auth: { user: { roles: [] } } } });

		render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createURL=""
					searchURL=""
					childPath=""
					roles={[]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		await screen.findByText("View tree")
	});
	it('should display the New button if the user has the right role', async () => {
		const store = mockStore({ users: { results: { stamp: 'stamp' }}, app: { auth: { user: { roles: ["role"] } } } });

		render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createURL=""
					searchURL=""
					childPath=""
					roles={["role"]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		await screen.findByText("New");
	});
	it('should not display the New button if the user does not have the right role', () => {
		const store = mockStore({ users: { results: { stamp: 'stamp' }}, app: { auth: { user: { roles: ["role"] } } } });

		const { queryByText } = render(
			<Provider store={store}>
				<OperationsObjectHome
					items={[]}
					createURL=""
					searchURL=""
					childPath=""
					roles={["role1"]}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		// eslint-disable-next-line
		expect(queryByText("New")).toBeNull();
	});
});
