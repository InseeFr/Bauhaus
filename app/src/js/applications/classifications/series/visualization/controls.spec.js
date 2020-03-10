import React from 'react';
import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('classification-series-visualization-controls', () => {
	it('renders without crashing', () => {
		render(<Controls />, { wrapper: MemoryRouter });
	});
});
