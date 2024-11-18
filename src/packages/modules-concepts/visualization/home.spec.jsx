import ConceptVisualization from './home';
import { renderWithAppContext } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';
import { empty } from '../utils/general';

describe('concept-visualization', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<ConceptVisualization
				id="id"
				general={empty()}
				notes={{}}
				links={[]}
				stampList={[]}
				disseminationStatusList={[]}
				validateConcept={vi.fn()}
				secondLang={true}
				langs={locales}
				permission={{ authType: '', roles: [''] }}
			/>,
		);
	});
});
