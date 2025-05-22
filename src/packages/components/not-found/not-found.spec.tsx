import { UnderMaintenance } from '.';
import { renderWithRouter } from '../../tests/render';

describe('not-found', () => {
	it('renders without crashing', () => {
		renderWithRouter(<UnderMaintenance />);
	});
});
