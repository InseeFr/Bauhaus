import { renderWithRouter } from '../../../tests-utils/render';
import Controls from './controls';

describe('classification-item-compare-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
