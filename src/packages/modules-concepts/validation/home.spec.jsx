import { renderWithRouter } from '../../tests-utils/render';
import ConceptValidation from './home';

describe('concept-validation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptValidation
				concepts={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateConceptList={vi.fn()}
			/>,
		);
	});
});
