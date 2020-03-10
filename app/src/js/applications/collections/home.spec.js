import React from 'react';
import { render } from '@testing-library/react';
import Collections from './home';
import { MemoryRouter } from 'react-router-dom';

describe('collections', () => {
	it('renders without crashing', () => {
		render(
			<Collections
				collections={[]}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
