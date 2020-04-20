import React from 'react';
import { render } from '@testing-library/react';
import MenuDSDs from '.';
import { MemoryRouter } from 'react-router-dom';

describe('menu-dsds', () => {
	it('renders without crashing', () => {
		render(<MenuDSDs />, {
			wrapper: MemoryRouter,
		});
	});
});
