import { renderWithRouter } from '../../tests/render';
import MenuConcepts from './index';

describe('menu-concepts', () => {
	it('renders without crashing', () => {
		renderWithRouter(<MenuConcepts />);
	});
});
