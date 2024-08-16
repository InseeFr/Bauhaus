import Home from './home';
import { renderWithRouter } from '../../tests-utils/render';

const families = [{ id: '1', label: 'Family 1' }];

describe('families-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Home families={families} />);
	});
});
