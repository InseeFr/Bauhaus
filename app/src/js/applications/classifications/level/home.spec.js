import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({});

const level = {
	general: { prefLabelLg1: 'Label', classificationId: 'id' },
	members: [{ id: '1', label: 'Member 1' }],
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-level-home', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Home level={level} langs={langs} secondLang={true} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
