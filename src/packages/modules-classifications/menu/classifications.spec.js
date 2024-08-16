import MenuClassifications from '.';
import { renderWithRouter } from '../../tests-utils/render';

describe('menu-classifications', () => {
	it('renders without crashing', () => {
		renderWithRouter(<MenuClassifications />);
	});
});
