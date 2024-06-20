import React from 'react';
import { render } from '@testing-library/react';
import MenuCodelists from '.';
import { MemoryRouter } from 'react-router-dom';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Auth } from 'js/utils';

const mockStore = configureStore([]);

describe('Menu Code List', () => {
	it('Should not crash', () => {
		const store = mockStore({
			app: { auth: { user: { roles: [Auth.ADMIN] } } },
		});

		render(
			<Provider store={store}>
				<MemoryRouter>
					<MenuCodelists />
				</MemoryRouter>
			</Provider>
		);
	});
});
