import CollectionsDashboardEdition from './';
import { renderWithRouter } from '../../../../../../tests-utils/render';

describe('dashboard-collections-edition', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<CollectionsDashboardEdition collectionsData={[]} type="creations" />
		);
	});
});
