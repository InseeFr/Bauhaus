import ConceptVisualizationControls from './controls';
import { renderWithRouter } from '../../tests-utils/render';

jest.mock('../../sdk');

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptVisualizationControls
				id="id"
				creator="creator"
				isValidated={false}
				conceptVersion="1"
				handleValidation={jest.fn()}
				permission={{ authType: '', roles: [''] }}
			/>
		);
	});
});
