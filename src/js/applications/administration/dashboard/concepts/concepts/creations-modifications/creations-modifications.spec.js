import ConceptsDashboardEdition from './';
import { renderWithRouter } from '../../../../../../new-architecture/tests-utils/render';
describe('dashboard-concepts-edition', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptsDashboardEdition conceptsData={[]} type="creations" />
		);
	});
});
