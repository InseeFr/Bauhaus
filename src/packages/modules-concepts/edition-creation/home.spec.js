import ConceptEditionCreation from './home';
import { empty } from '../utils/general';
import { renderWithRouter } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';

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