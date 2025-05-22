import { renderWithRouter } from '../../tests/render';
import Controls from './controls';

describe('classification-level-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls id="nafr2" />);
	});
});
