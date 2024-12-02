import { Provider } from 'react-redux';

import MenuCodelists from '.';
import { ADMIN } from '../../auth/roles';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';

describe('Menu Code List', () => {
	it('Should not crash', () => {
		const store = configureStore({
			app: { auth: { user: { roles: [ADMIN] } } },
		});

		renderWithRouter(
			<Provider store={store}>
				<MenuCodelists />
			</Provider>,
		);
	});
});
