import CollectionMembers from './members';
import { renderWithRouter } from '../../../tests-utils/render';

describe('collection-edition-creation-members', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<CollectionMembers
				members={[]}
				conceptList={[]}
				handleChange={vi.fn()}
			/>
		);
	});
});
