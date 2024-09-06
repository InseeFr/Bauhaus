import ConceptVisualization from './home';
import { empty } from '../utils/general';
import { renderWithAppContext } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';

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
				validateConcept={jest.fn()}
				secondLang={true}
				langs={locales}
				permission={{ authType: '', roles: [''] }}
			/>
		);
	});
});
