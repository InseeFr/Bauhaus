import { render } from '@testing-library/react';
import AdvancedSearch from './home';
import { MemoryRouter } from 'react-router-dom';
describe('concepts-advanced-search', () => {
	it('renders without crashing', () => {
		render(
			<AdvancedSearch
				conceptSearchList={[]}
				stampList={[]}
				disseminationStatusList={[]}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
