import { renderWithRouter } from '../../../tests/render';
import SearchConceptsByLabel from './search-concepts-by-label';

describe('concept-edition-creation-search-concepts-by-label', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<SearchConceptsByLabel
				searchLabel="label"
				hitEls={[]}
				handleSearch={vi.fn()}
			/>,
		);
	});
});
