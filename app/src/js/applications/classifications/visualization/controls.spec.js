import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Controls from './controls';

const mockStore = configureStore([]);
const store = mockStore({
	users: { results: { stamp: 'stamp' } },
	app: { secondLang: true, auth: { type: '', user: { roles: [] } } },
});

describe('classification-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Controls classification={{}} publish={() => {}} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
