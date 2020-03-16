import React from 'react';
import { render } from '@testing-library/react';
import Concepts from './home';
import { MemoryRouter } from 'react-router-dom';

describe('concept', () => {
	it('renders without crashing', () => {
		render(
			<Concepts concepts={[]} permission={{ authType: '', roles: [''] }} />,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
