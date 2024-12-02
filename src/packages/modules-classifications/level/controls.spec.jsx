import { renderWithRouter } from '../../tests-utils/render';
import Controls from './controls';

describe('classification-level-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls id="nafr2" />);
	});
});
