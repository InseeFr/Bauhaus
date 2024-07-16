import ConceptVisualizationControls from './controls';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

jest.mock('../../../remote-api/concepts-api');

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
