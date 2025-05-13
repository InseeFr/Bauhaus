import { locales } from '../../tests-utils/default-values';
import { RBACMock } from '../../tests-utils/rbac';
import {
	mockReactQueryForRbac,
	renderWithAppContext,
} from '../../tests-utils/render';
import { empty } from '../utils/general';

describe('concept-visualization', () => {
	it('renders without crashing', async () => {
		mockReactQueryForRbac([]);

		const { default: ConceptVisualization } = await import('./home');

		renderWithAppContext(
			<RBACMock roles={[]}>
				<ConceptVisualization
					id="id"
					general={empty()}
					notes={{}}
					links={[]}
					validateConcept={vi.fn()}
					secondLang={true}
					langs={locales}
					serverSideError=""
					deleteConcept={vi.fn()}
				/>
			</RBACMock>,
			false,
		);
	});
});
