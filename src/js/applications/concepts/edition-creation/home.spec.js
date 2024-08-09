import ConceptEditionCreation from './home';
import { empty } from '../../../utils/concepts/general';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
import { locales } from '../../../new-architecture/tests-utils/default-values';

jest.mock('./general');

describe('concept-edition-creation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptEditionCreation
				id="id"
				creation={true}
				title="title"
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				stampList={[]}
				save={jest.fn()}
				langs={locales}
			/>
		);
	});
});
