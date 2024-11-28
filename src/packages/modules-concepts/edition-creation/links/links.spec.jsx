import { renderWithRouter } from '../../../tests-utils/render';
import ConceptLinks from './';

describe('concept-edition-creation-links', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptLinks
				conceptsWithLinks={[]}
				handleChange={vi.fn()}
				handleChangeEquivalentLinks={vi.fn()}
			/>,
		);
	});
});
