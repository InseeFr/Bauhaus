import { renderWithRouter } from '../../tests-utils/render';
import AdvancedSearch from './home';

describe('concepts-advanced-search', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<AdvancedSearch
				conceptSearchList={[]}
				stampList={[]}
				disseminationStatusList={[]}
			/>,
		);
	});
});
