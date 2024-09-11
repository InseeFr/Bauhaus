import SearchConceptsByLabel from './search-concepts-by-label';
import { renderWithRouter } from '../../../tests-utils/render';

describe('concept-edition-creation-search-concepts-by-label', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<SearchConceptsByLabel
				searchLabel="label"
				hitEls={[]}
				handleSearch={vi.fn()}
			/>
		);
	});
});
