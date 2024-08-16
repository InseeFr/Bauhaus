import { UnderMaintenance } from '.';
import { renderWithRouter } from '../../tests-utils/render';

describe('not-found', () => {
	it('renders without crashing', () => {
		renderWithRouter(<UnderMaintenance />);
	});
});
