import ConceptDashboardControls from './controls';
import { renderWithRouter } from '../../../../tests-utils/render';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<ConceptDashboardControls />);
	});
});
