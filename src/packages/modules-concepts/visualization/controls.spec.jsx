import { renderWithRouter } from '../../tests-utils/render';
import ConceptVisualizationControls from './controls';

vi.mock('../../sdk');

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptVisualizationControls
				id="id"
				creator="creator"
				isValidated={false}
				conceptVersion="1"
				handleValidation={vi.fn()}
				permission={{ authType: '', roles: [''] }}
			/>,
		);
	});
});
