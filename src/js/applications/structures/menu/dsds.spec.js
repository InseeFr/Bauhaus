import MenuDSDs from '.';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('menu-dsds', () => {
	it('renders without crashing', () => {
		renderWithRouter(<MenuDSDs />);
	});
});
