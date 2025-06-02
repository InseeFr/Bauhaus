import { renderWithRouter } from '../../../tests/render';
import { AdvancedSearchForm } from './search';

vi.mock('@tanstack/react-query', () => ({
	useQuery: vi.fn().mockReturnValue({
		isLoading: true,
		data: ['data'],
	}),
}));

describe('advanced search component', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<AdvancedSearchForm data={[]} seriesOperationsOptions={[]} />,
		);
	});
});
