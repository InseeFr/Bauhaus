import { renderWithRouter } from '../tests-utils/render';
import Home from './home';

const classifications = [{ id: '1', label: 'Classification 1' }];

describe('classifications-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Home classifications={classifications} />);
	});
});
