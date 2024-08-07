import { UnderMaintenance } from '.';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('not-found', () => {
	it('renders without crashing', () => {
		renderWithRouter(<UnderMaintenance />);
	});
});
