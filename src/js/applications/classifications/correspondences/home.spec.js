import Home from './home';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

const correspondences = [{ id: '1', label: 'Correspondence 1' }];

describe('correspondences-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Home correspondences={correspondences} />);
	});
});
