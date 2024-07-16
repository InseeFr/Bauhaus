import Controls from './controls';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('classification-level-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls id="nafr2" />);
	});
});
