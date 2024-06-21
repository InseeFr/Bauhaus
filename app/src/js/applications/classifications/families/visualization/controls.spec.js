import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('classification-family-visualization-controls', () => {
	it('renders without crashing', () => {
		render(<Controls />, {
			wrapper: MemoryRouter,
		});
	});
});
