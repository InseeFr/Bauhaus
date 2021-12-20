import React from 'react';
import { render } from '@testing-library/react';
import { NOT_LOADED, LOADED } from 'js/constants';
import { MemoryRouter } from 'react-router-dom';

import { mapStateToProps, FamiliesHomeContainer } from './index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({ users: { results: {stamp: 'stamp'}}, app: { auth: { user: { roles: [] } } } });

describe('FamiliesHomeContainer', () => {
	it('should display a LOADING component if the status is not LOADED', () => {
		const { container } = render(
			<FamiliesHomeContainer
				loadFamiliesList={jest.fn()}
				status={NOT_LOADED}
			/>,
			{ wrapper: MemoryRouter }
		);
		expect(container.querySelectorAll('.wilco-loading').length).toBe(1);
		expect(container.querySelectorAll('.list-group').length).toBe(0);
	});
	it('should display a FamiliesHome component if the status is  LOADED', () => {
		const { container } = render(
			<Provider store={store}>
				<FamiliesHomeContainer loadFamiliesList={jest.fn()} status={LOADED} />
			</Provider>,
			{ wrapper: MemoryRouter }
		);
		expect(container.querySelectorAll('.wilco-loading').length).toBe(0);
		expect(container.querySelectorAll('.list-group').length).toBe(1);
	});

});
