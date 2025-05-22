import { renderWithRouter } from '../../../tests/render';
import Controls from './controls';

describe('classification-item-compare-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
