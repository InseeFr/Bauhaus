import React from 'react';
import { render } from '@testing-library/react';
import MenuCodelists from '.';
import { MemoryRouter } from 'react-router-dom';

describe('menu-codelists', () => {
	it('renders without crashing', () => {
		render(<MenuCodelists />, { wrapper: MemoryRouter });
	});
});
