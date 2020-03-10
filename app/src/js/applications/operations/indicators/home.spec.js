import React from 'react';
import { render } from '@testing-library/react';
import IndicatorsHome from './home';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({ app: { auth: { user: { roles: [] } } } });

describe('IndicatorsHome', () => {
	it('should display the PageTitle component', () => {
		const { container } = render(
			<Provider store={store}>
				<IndicatorsHome indicators={[]} permission={{}} />
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		expect(container.querySelectorAll('h1').length).toBe(1);
	});
	it('should display the SearchableList component', () => {
		const { container } = render(
			<Provider store={store}>
				<IndicatorsHome indicators={[]} permission={{}} />
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		expect(container.querySelectorAll('.list-group').length).toBe(1);
	});
});
