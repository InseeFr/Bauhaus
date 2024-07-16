import ConceptLinks from './';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

describe('concept-edition-creation-links', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptLinks
				conceptsWithLinks={[]}
				handleChange={jest.fn()}
				handleChangeEquivalentLinks={jest.fn()}
			/>
		);
	});
});
