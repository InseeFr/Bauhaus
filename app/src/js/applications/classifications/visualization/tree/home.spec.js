import React from 'react';
import { render } from '@testing-library/react';
import ClassificationTree from './home';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({
	app: { secondLang: true },
});

describe('classification-tree-home', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<ClassificationTree data={[]} prefLabel="prefLabel" secondLang={true} />
			</Provider>,
			{ wrapper: MemoryRouter }
		);
	});
});
