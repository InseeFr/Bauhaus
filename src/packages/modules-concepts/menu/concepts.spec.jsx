import MenuConcepts from './index';
import { renderWithRouter } from '../../tests-utils/render';

describe('menu-concepts', () => {
	it('renders without crashing', () => {
		console.log(MenuConcepts);
		renderWithRouter(
			<MenuConcepts
				location={{ pathname: '/location' }}
				permission={{ authType: 'authType', roles: [] }}
			/>
		);
	});
});
