import React from 'react';
import { render } from '@testing-library/react';
import { MenuOperations } from '.';
import { MemoryRouter } from 'react-router-dom';

describe('menu-operations', () => {
	it('renders without crashing', () => {
		render(
			<MenuOperations location={{ pathname: '/location' }} permission={{}} />,
			{ wrapper: MemoryRouter }
		);
	});
});
