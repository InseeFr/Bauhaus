import React from 'react';
import { render } from '@testing-library/react';
import OperationsObjectHome from './index';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({ app: { auth: { user: { roles: [] } } } });

describe('FamiliesHome', () => {
	it('should display the PageTitle component', () => {
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
});
