import { AdvancedSearchControls } from './controls';
import { render } from '@testing-library/react';

describe('concepts-advanced-search-controls', () => {
	it('renders without crashing', () => {
		render(
			<AdvancedSearchControls
				onClickReturn={vi.fn()}
				initializeState={vi.fn()}
			/>
		);
	});
});
