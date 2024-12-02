import { renderWithRouter } from '../../tests-utils/render';
import Home from './home';

const families = [{ id: '1', label: 'Family 1' }];

describe('families-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Home families={families} />);
	});
});
