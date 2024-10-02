import { MenuOperations } from '.';
import { renderWithRouter } from '../../tests-utils/render';

describe('menu-operations', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<MenuOperations location={{ pathname: '/location' }} permission={{}} />,
		);
	});
});
