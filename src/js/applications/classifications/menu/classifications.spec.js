import MenuClassifications from '.';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('menu-classifications', () => {
	it('renders without crashing', () => {
		renderWithRouter(<MenuClassifications />);
	});
});
