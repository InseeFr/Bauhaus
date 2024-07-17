import MenuCodelists from '.';

import { Provider } from 'react-redux';
import { Auth } from '../../../utils';
import configureStore from '../../../store/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('Menu Code List', () => {
	it('Should not crash', () => {
		const store = configureStore({
			app: { auth: { user: { roles: [Auth.ADMIN] } } },
		});

		renderWithRouter(
			<Provider store={store}>
				<MenuCodelists />
			</Provider>
		);
	});
});
