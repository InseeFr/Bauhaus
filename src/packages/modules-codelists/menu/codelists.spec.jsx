import MenuCodelists from '.';

import { Provider } from 'react-redux';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';
import { ADMIN } from '../../auth/roles';

describe('Menu Code List', () => {
	it('Should not crash', () => {
		const store = configureStore({
			app: { auth: { user: { roles: [ADMIN] } } },
		});

		renderWithRouter(
			<Provider store={store}>
				<MenuCodelists />
			</Provider>
		);
	});
});
