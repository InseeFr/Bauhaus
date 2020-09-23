import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SimsGeographyPicker from './sims-geography-picker';
import { render } from '@testing-library/react';
import { Auth } from 'bauhaus-utilities';

const mockStore = configureStore([]);

describe('<SimsGeographyPicker />', () => {
	it('should display the ADD buttun if the user is an admin', () => {
		const store = mockStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: [Auth.ADMIN],
						stamp: '',
					},
				},
			},
			geographies: {
				results: [],
			},
		});
		const { container } = render(
			<Provider store={store}>
				<SimsGeographyPicker />
			</Provider>
		);
		expect(
			container.querySelector('.bauhaus-sims-geography-picker > button')
		).not.toBeNull();
	});
	it('should not display the ADD buttun if the user is not an admin', () => {
		const store = mockStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: [],
						stamp: '',
					},
				},
			},
			geographies: {
				results: [],
			},
		});
		const { container } = render(
			<Provider store={store}>
				<SimsGeographyPicker />
			</Provider>
		);
		expect(
			container.querySelector('.bauhaus-sims-geography-picker > button')
		).toBeNull();
	});
});
