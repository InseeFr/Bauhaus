import React from 'react';
import { render } from '@testing-library/react';
import Administration from './home';
import { MemoryRouter } from 'react-router-dom';

describe('administration', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<Administration permission={{ authType: '', roles: [''] }} />
			</MemoryRouter>
		);
	});
});
