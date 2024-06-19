import React from 'react';
import { render } from '@testing-library/react';
import MenuConcepts from '.';
import { MemoryRouter } from 'react-router-dom';

describe('menu-concepts', () => {
	it('renders without crashing', () => {
		render(
			<MenuConcepts
				location={{ pathname: '/location' }}
				permission={{ authType: 'authType', roles: [] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
