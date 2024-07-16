import { MenuOperations } from '.';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('menu-operations', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<MenuOperations location={{ pathname: '/location' }} permission={{}} />
		);
	});
});
