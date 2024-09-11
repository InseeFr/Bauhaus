import Controls from './controls';
import { renderWithRouter } from '../../tests-utils/render';

describe('classification-level-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls id="nafr2" />);
	});
});
