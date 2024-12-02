import { renderWithRouter } from '../../../../tests-utils/render';
import ConceptDashboardControls from './controls';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<ConceptDashboardControls />);
	});
});
