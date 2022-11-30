import React from 'react';
import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ADMIN } from 'bauhaus-utilities/src/auth/roles';
import { Provider } from 'react-redux';


const mockStore = configureStore([]);
const store = mockStore({
	users: { results: { stamp: 'stamp' } },
	app: {
		secondLang: true,
		auth: {
			user: {
				roles: [ADMIN]
			}
		}
	},
});

describe('classification-item-controls', () => {
	it('renders without crashing', () => {
		render(<Provider store={store}><Controls classificationId="nafr2" itemId="A" version={'1'} /></Provider>, {
			wrapper: MemoryRouter,
		});
	});
});
