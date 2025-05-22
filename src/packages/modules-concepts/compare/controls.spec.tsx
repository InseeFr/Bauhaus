import { renderWithRouter } from '../../tests/render';
import ConceptCompare from './controls';

describe('concept-visualization-compare-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<ConceptCompare />);
	});
});
