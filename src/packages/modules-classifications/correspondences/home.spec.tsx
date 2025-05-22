import { renderWithRouter } from '../../tests/render';
import Home from './home';

const correspondences = [{ id: '1', label: 'Correspondence 1' }];

describe('correspondences-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Home correspondences={correspondences} />);
	});
});
