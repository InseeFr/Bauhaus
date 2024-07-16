import { render } from '@testing-library/react';
import MenuCodelists from '.';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { Auth } from '../../../utils';
import configureStore from '../../../store/configure-store';

describe('Menu Code List', () => {
	it('Should not crash', () => {
		const store = configureStore({
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
