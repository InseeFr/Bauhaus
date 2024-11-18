import { renderWithRouter } from '../../../../../../tests-utils/render';
import ConceptsDashboardEdition from './';

describe('dashboard-concepts-edition', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<ConceptsDashboardEdition conceptsData={[]} type="creations" />,
		);
	});
});
