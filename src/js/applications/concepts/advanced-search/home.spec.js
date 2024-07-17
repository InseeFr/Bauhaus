import AdvancedSearch from './home';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
describe('concepts-advanced-search', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<AdvancedSearch
				conceptSearchList={[]}
				stampList={[]}
				disseminationStatusList={[]}
			/>
		);
	});
});
