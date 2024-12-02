import { renderWithRouter } from '../../tests-utils/render';
import ConceptCompare from './controls';

describe('concept-visualization-compare-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<ConceptCompare />);
	});
});
