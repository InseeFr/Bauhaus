import Home from './home';
import { renderWithRouter } from '../../new-architecture/tests-utils/render';

const classifications = [{ id: '1', label: 'Classification 1' }];

describe('classifications-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Home classifications={classifications} />);
	});
});
