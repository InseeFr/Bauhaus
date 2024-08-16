import AdvancedSearch from './home';
import { renderWithRouter } from '../../tests-utils/render';
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
