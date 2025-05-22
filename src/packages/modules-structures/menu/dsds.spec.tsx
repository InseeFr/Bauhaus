import MenuDSDs from '.';
import { renderWithRouter } from '../../tests/render';

describe('menu-dsds', () => {
	it('renders without crashing', () => {
		renderWithRouter(<MenuDSDs />);
	});
});
