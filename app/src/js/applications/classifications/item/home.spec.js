import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ADMIN } from 'js/utils/auth/roles';

const mockStore = configureStore([]);
const store = mockStore({
	users: { results: { stamp: 'stamp' } },
	app: {
		secondLang: true,
		auth: {
			user: {
				roles: [ADMIN],
			},
		},
	},
});

const item = {
	general: {
		prefLabelLg1: 'Label',
		classificationId: 'id',
		itemId: 'itemId',
		conceptVersion: 'conceptVersion',
	},
	notes: {},
	narrowers: [{ id: '1', label: 'Narrower 1' }],
};

const langs = { lg1: 'fr', lg2: 'en' };

describe('classification-item-home', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Home item={item} langs={langs} secondLang={true} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
