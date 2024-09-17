import Controls from './controls';
import { renderWithRouter } from '../../../tests-utils/render';

describe('classification-series-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
