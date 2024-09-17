import Controls from './controls';
import { render } from '@testing-library/react';

describe('concepts-advanced-search-controls', () => {
	it('renders without crashing', () => {
		render(
			<Controls
				onClickReturn={vi.fn()}
				initializeState={vi.fn()}
				conceptsList={[]}
			/>
		);
	});
});
