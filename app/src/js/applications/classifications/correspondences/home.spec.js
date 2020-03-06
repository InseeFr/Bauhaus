import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';

const correspondences = [{ id: '1', label: 'Correspondence 1' }];

describe('correspondences-home', () => {
	it('renders without crashing', () => {
		render(<Home correspondences={correspondences} />, {
			wrapper: MemoryRouter,
		});
	});
});
