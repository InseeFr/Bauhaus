import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Stores } from 'bauhaus-utilities';
import CreationContainer from './creation-container';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		lg1: 'fr',
		lg2: 'en',
		properties: {
			maxLengthScopeNote: 10
		},
	},
});


describe('EditionContainer', () => {
	it('should call getDisseminationStatus', () => {
		Stores.DisseminationStatus.api.getDisseminationStatus = jest.fn().mockImplementation(() => {
			return Promise.resolve([]);
		})
		render(
			<Provider store={store}>
				<MemoryRouter><CreationContainer /></MemoryRouter>
			</Provider>
		)

		expect(Stores.DisseminationStatus.api.getDisseminationStatus).toHaveBeenCalledWith();
	})
})
