import MenuConcepts from './index';
import { renderWithRouter } from '../../tests-utils/render';

describe('menu-concepts', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<MenuConcepts
				location={{ pathname: '/location' }}
				permission={{ authType: 'authType', roles: [] }}
			/>,
		);
	});
});
