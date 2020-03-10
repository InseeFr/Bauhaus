import React from 'react';
import { render } from '@testing-library/react';
import HelpConcepts from './home';
import { MemoryRouter } from 'react-router-dom';

describe('help-concepts', () => {
	it('renders without crashing', () => {
		render(
			<HelpConcepts
				match={{ params: { id: 1 } }}
				location={{ pathname: '/concepts' }}
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
