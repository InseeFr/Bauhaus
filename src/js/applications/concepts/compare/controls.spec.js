import ConceptCompare from './controls';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('concept-visualization-compare-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<ConceptCompare />);
	});
});
