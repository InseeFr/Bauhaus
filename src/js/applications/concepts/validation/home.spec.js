import ConceptValidation from './home';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

describe('concept-validation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptValidation
				concepts={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateConceptList={jest.fn()}
			/>
		);
	});
});
