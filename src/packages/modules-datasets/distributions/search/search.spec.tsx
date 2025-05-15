import { renderWithRouter } from '../../../tests-utils/render';
import { AdvancedSearchForm } from './search';

describe('advanced search component', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<AdvancedSearchForm data={[]} seriesOperationsOptions={[]} />,
		);
	});
});
