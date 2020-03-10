import React from 'react';
import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('classification-item-compare-controls', () => {
	it('renders without crashing', () => {
		render(<Controls />, {
			wrapper: MemoryRouter,
		});
	});
});
