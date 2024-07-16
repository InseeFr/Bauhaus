import MenuConcepts from '.';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('menu-concepts', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<MenuConcepts
				location={{ pathname: '/location' }}
				permission={{ authType: 'authType', roles: [] }}
			/>
		);
	});
});
