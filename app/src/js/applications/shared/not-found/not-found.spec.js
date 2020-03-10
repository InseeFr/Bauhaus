import React from 'react';
import { render } from '@testing-library/react';
import NotFound from '.';
import { MemoryRouter } from 'react-router-dom';

describe('not-found', () => {
	it('renders without crashing', () => {
		render(<NotFound />, { wrapper: MemoryRouter });
	});
});
