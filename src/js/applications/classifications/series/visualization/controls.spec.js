import Controls from './controls';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

describe('classification-series-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
