import MenuDSDs from '.';
import { renderWithRouter } from '../../tests-utils/render';

describe('menu-dsds', () => {
	it('renders without crashing', () => {
		renderWithRouter(<MenuDSDs />);
	});
});
