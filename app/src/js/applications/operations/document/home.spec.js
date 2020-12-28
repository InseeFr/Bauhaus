import React from 'react';
import { render } from '@testing-library/react';
import DocumentHome from './home';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({ users: { results: {stamp: 'stamp'}}, app: { auth: { user: { roles: [] } } } });

describe('DocumentHome', () => {
	it('should display the PageTitle component', () => {
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
});
