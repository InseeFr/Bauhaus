import { locales } from '../../tests-utils/default-values';
import { renderWithAppContext } from '../../tests-utils/render';
import { empty } from '../utils/general';
import ConceptVisualization from './home';

describe('concept-visualization', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<ConceptVisualization
				id="id"
				general={empty()}
				notes={{}}
				links={[]}
				validateConcept={vi.fn()}
				secondLang={true}
				langs={locales}
				permission={{ authType: '', roles: [''] }}
				serverSideError=""
				deleteConcept={vi.fn()}
			/>,
		);
	});
});
